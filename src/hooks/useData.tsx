import { useCallback, useState } from "react";
import { Cat, Question, QuestionKey, type IAssignedAnswer, type ICat, type ICatDto, type IQuestion, type IQuestionDtoEx, type IQuestionEx, type IQuestionKey, type IQuestionRow, type IQuestionRowDto, type IQuestionRowDtosEx } from "../categories/types";
import { HistoryDto, HistoryFilterDto, type IHistory, type IHistoryDto, type IHistoryDtoEx, type IHistoryFilter } from "../global/types";
import { protectedResources } from "../authConfig";


import type { IAuthUser, IChatBotAnswer, IGlobalState, INewQuestion, INextAnswer, USER_ANSWER_ACTION } from '../global/types';

class ChatBotAnswer {
  constructor(assignedAnswer: IAssignedAnswer) {
    const { topId, id, answerTitle, answerLink, created, modified } = assignedAnswer;
    this.chatBotAnswer = {
      topId,
      id,
      answerTitle: answerTitle ?? '',
      answerLink: answerLink ?? '',
      created: assignedAnswer.created!,
      modified: assignedAnswer.modified!
    }
  }
  chatBotAnswer: IChatBotAnswer
}

const initialGlobalState: IGlobalState = {
  isAuthenticated: null,
  ws: '',
  everLoggedIn: false,
  canAdd: false,
  isOwner: false,
  isDarkMode: true,
  variant: '',
  bg: ''
}


export const useData = (ws: string): [
  Map<string, ICat> | null, // allCats
  () => Promise<Map<string, ICat>>, // loadCats
  (questionKey: IQuestionKey) => Promise<IQuestionEx>, // getQuestion
  IQuestion | null, // selectedQuestion
  IChatBotAnswer | null, // firstAnswer
  boolean, // hasMoreAnswers
  () => Promise<INextAnswer>, // getNextAnswer
  (filter: string, count: number) => Promise<IQuestionRow[]>, // searchQuestions
  (userAction: string) => Promise<void>, // addHistory
  (underFilter: string) => Promise<void> // addHistoryFilter
] => {

  const [globalState, setGlobalState] = useState<IGlobalState>(initialGlobalState);
  const [authUser, setAuthUser] = useState<IAuthUser>({ nickName: '', name: '' });
  const [workspace] = useState(ws);
  const [allCats, setAllCats] = useState<Map<string, ICat> | null>(null);
  const [newQuestion, setNewQuestion] = useState<INewQuestion | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);
  const [hasMoreAnswers, setHasMoreAnswers] = useState(false);
  const [nextAnswer, setNextAnswer] = useState<IChatBotAnswer | null>(null);
  const [index, setIndex] = useState(-1);

  const Execute = async (method: string, endpoint: string, data: object | null = null): Promise<object> => {
    //const accessToken = localStorage.getItem("accessToken");
    const accessToken = "1234567";
    if (accessToken) {
      try {
        //console.log({ accessToken })
        let response = null;

        const headers = new Headers();
        //const bearer = `Bearer ${accessToken}`;
        //headers.append("Authorization", bearer);

        if (data) headers.append('Content-Type', 'application/json');

        const options = {
          method: method,
          headers: headers,
          body: data ? JSON.stringify(data) : null,
        };

        response = (await fetch(endpoint, options));
        if (response.ok) {
          if ((response.status === 200 || response.status === 201)) {
            let responseData = null; //response;
            try {
              responseData = await response.json();
            }
            catch (error) {
              console.log(error)
              //dispatch({ type: GlobalActionTypes.SET_ERROR, payload: { error: new Error(`Response status: ${response.status}`) } });
            }
            // finally {
            // }
            return responseData;
          }
        }
        else {
          //const { errors } = await response.json();
          const error = new Error(
            //errors?.map((e: { message: any }) => e.message).join('\n') ?? 'unknown',
          )
          console.log(error);
          //dispatch({ type: GlobalActionTypes.SET_ERROR, payload: { error } });
        }
      }
      catch (e) {
        console.log('-------------->>> execute', method, endpoint, e)
        //dispatch({ type: GlobalActionTypes.SET_ERROR, payload: { error: new Error(`fetch eror`) } });
      }
    }
    return JSON.parse("")
  }

  const loadCats = useCallback(async (): Promise<Map<string, ICat>> => {
    return new Promise((resolve) => {
      const cats = new Map<string, ICat>();
      try {
        console.time();
        const url = `${protectedResources.KnowledgeAPI.endpointCategoryRow}/${workspace}/allCats`;
        Execute("GET", url, null)
          .then((value: object) => {
            console.timeEnd();
            const catDtos: ICatDto[] = value as ICatDto[];
            catDtos.forEach((catDto: ICatDto) => cats.set(catDto.Id, new Cat(catDto).cat));
            cats.forEach((cat: ICat) => {
              const { id, parentId } = cat;
              let titlesUpTheTree = id;
              let parentCat = parentId;
              while (parentCat) {
                const cat2 = cats.get(parentCat)!;
                titlesUpTheTree = cat2!.id + ' / ' + titlesUpTheTree;
                parentCat = cat2.parentId;
              }
              cat.titlesUpTheTree = titlesUpTheTree;
              cats.set(id, cat);
            })
            setAllCats(cats);
            resolve(cats);
          });
      }
      catch (error: unknown) {
        console.log(error)
      }
    });
  }, [workspace]);


  const getQuestion = async (questionKey: IQuestionKey): Promise<IQuestionEx> => {
    return new Promise((resolve) => {
      try {
        const { topId, id } = questionKey;
        const query = new QuestionKey(questionKey).toQuery(workspace);
        const url = `${protectedResources.KnowledgeAPI.endpointQuestion}?${query}`;
        console.time();
        Execute("GET", url)
          .then((value: object): void => {
            const x: IQuestionDtoEx = value as IQuestionDtoEx;
            console.timeEnd();
            const { questionDto, msg } = x;
            if (questionDto) {
              const question = new Question(questionDto).question;
              let newQ: INewQuestion | null = null;
              if (question) {
                const { assignedAnswers } = question;
                if (assignedAnswers && assignedAnswers.length > 0) {
                  const assignedAnswer = assignedAnswers[0];
                  const firstA = new ChatBotAnswer(assignedAnswer).chatBotAnswer;
                  const hasMoreAs = assignedAnswers.length > 1;
                  newQ = {
                    question,
                    firstAnswer: firstA,
                    hasMoreAnswers: hasMoreAs
                  }
                  setHasMoreAnswers(hasMoreAs);
                  setIndex(0);
                }
              }
              setNewQuestion(newQ);
              setSelectedQuestion(question);
              resolve({ ...newQ, msg: '' } as IQuestionEx)
            }
            else {
              setNewQuestion(null);
              setSelectedQuestion(null);
              setIndex(-1);
              resolve({ question: null, msg } as IQuestionEx)
            }
          });
      }
      catch (error: unknown) {
        console.log(error);
        const questionEx: IQuestionEx = {
          question: null,
          firstAnswer: null,
          msg: "Problemos"
        }
        resolve(questionEx);
      }
    })
  }

  //const searchQuestions = useCallback(async (execute: (method: string, endpoint: string) => Promise<any>, filter: string, count: number): Promise<any> => {
  const searchQuestions = async (filter: string, count: number): Promise<IQuestionRow[]> => {
    return new Promise((resolve) => {
      try {
        console.time();
        const filterEncoded = encodeURIComponent(filter);
        const url = `${protectedResources.KnowledgeAPI.endpointQuestion}/${workspace}/${filterEncoded}/${count}/null`;
        Execute("GET", url)
          .then((x: object) => {
            const dtosEx: IQuestionRowDtosEx = x as IQuestionRowDtosEx
            const { questionRowDtos, msg } = dtosEx;
            console.log('questionRowDtos:', { dtos: dtosEx }, protectedResources.KnowledgeAPI.endpointCategoryRow);
            console.timeEnd();
            if (questionRowDtos) {
              const questionRows: IQuestionRow[] = questionRowDtos.map((dto: IQuestionRowDto) => {
                const { TopId, ParentId, Id, Title, NumOfAssignedAnswers, Included } = dto;
                return {
                  topId: TopId,
                  parentId: ParentId ?? '',
                  id: Id,
                  title: Title,
                  categoryTitle: '',
                  numOfAssignedAnswers: NumOfAssignedAnswers ?? 0,
                  included: Included ?? false,
                }
              })
              // const list: IQuestionRow[] = dtos.map((q: IQuestionRowDto) => ({
              //   topId: q.PartitionKey,
              //   id: q.Id,
              //   parentId: q.ParentId,
              //   numOfAssignedAnswers: q.NumOfAssignedAnswers ?? 0,
              //   title: q.Title,
              //   categoryTitle: '',
              //   isSelected: q.Included !== undefined
              // }))
              resolve(questionRows);
            }
            else {
              // reject()
              console.log('no rows in search')
            }
          })
      }
      catch (error: unknown) {
        console.log(error)
        //dispatch({ type: GlobalActionTypes.SET_ERROR, payload: { error } });
      }
    });
  }
  //}, []);


  const getNextAnswer = useCallback(
    async (): Promise<INextAnswer> => {
      const { assignedAnswers } = newQuestion!.question!;
      const len = assignedAnswers.length;
      const i = index + 1;
      if (index + 1 < len) {
        setIndex(i);
        return {
          nextChatBotAnswer: new ChatBotAnswer(assignedAnswers[i]).chatBotAnswer,
          hasMoreAnswers: i + 1 < len
        }
      }
      return { nextChatBotAnswer: null, hasMoreAnswers: false }
    }, [newQuestion, index]);


  const addHistory = useCallback(
    async (userAction: string): Promise<void> => {
      const { assignedAnswers } = selectedQuestion!;
      const assignedAnswer = assignedAnswers[index];
      const history: IHistory = {
        questionKey: new QuestionKey(selectedQuestion!).questionKey!,
        assignedAnswerKey: { topId: assignedAnswer.topId, id: assignedAnswer.id },
        userAction: userAction as USER_ANSWER_ACTION,
        created: {
          nickName: authUser.nickName,
          time: new Date()
        }
      }
      //const { topId, id, variations, title, kind, modified } = history;
      //dispatch({ type: ActionTypes.SET_CATEGORY_LOADING, payload: { id, loading: false } });
      try {
        const historyDto = new HistoryDto(history, workspace).historyDto;
        console.log("historyDto", { historyDto })
        const url = `${protectedResources.KnowledgeAPI.endpointHistory}`;
        console.time()
        await Execute("POST", url, historyDto)
          .then((x: object) => {
            const questionDtoEx: IQuestionDtoEx = x as IQuestionDtoEx;
            const { questionDto, msg } = questionDtoEx;
            console.timeEnd();
            if (questionDto) {
              //const history = new History(historyDto).history;
              console.log('History successfully created', { questionDto })
              //return history;
              // dispatch({ type: ActionTypes.SET_ADDED_CATEGORY, payload: { category: { ...category, questions: [] } } });
              // dispatch({ type: ActionTypes.CLOSE_CATEGORY_FORM })
              //await loadCats(); // reload
            }
          });
      }
      catch (error: unknown) {
        console.log(error)
        //dispatch({ type: ActionTypes.SET_ERROR, payload: { error: new Error('Server Error') } });
      }
    }, [workspace, authUser, selectedQuestion, index]);


  const addHistoryFilter = useCallback(async (underFilter: string): Promise<void> => {
    //const { topId, id, variations, title, kind, modified } = history;
    //dispatch({ type: ActionTypes.SET_CATEGORY_LOADING, payload: { id, loading: false } });
    try {
      if (newQuestion === null)
        return;

      const { question } = newQuestion;
      const historyFilter: IHistoryFilter = {
        questionKey: new QuestionKey(question!).questionKey!,
        filter: underFilter,
        created: { time: new Date(), nickName: authUser.nickName }
      }
      const historyFilterDto = new HistoryFilterDto(historyFilter, workspace).historyFilterDto;
      //console.log("historyDto", { historyDto })
      const url = `${protectedResources.KnowledgeAPI.endpointHistoryFilter}`;
      console.time()
      await Execute("POST", url, historyFilterDto)
        .then((x: object) => {
          const questionDtoEx: IQuestionDtoEx = x as IQuestionDtoEx;
          const { questionDto, msg } = questionDtoEx;
          console.timeEnd();
          if (questionDto) {
            //const history = new History(historyDto).history;
            console.log('History Filter successfully created', { questionDto });
            // dispatch({ type: ActionTypes.SET_ADDED_CATEGORY, payload: { category: { ...category, questions: [] } } });
            // dispatch({ type: ActionTypes.CLOSE_CATEGORY_FORM })
            //await loadCats(); // reload
          }
        });
    }
    catch (error: unknown) {
      console.log(error)
      //dispatch({ type: ActionTypes.SET_ERROR, payload: { error: new Error('Server Error') } });
    }
  }, [workspace]);

  return [
    allCats, loadCats,
    getQuestion, selectedQuestion, hasMoreAnswers, getNextAnswer,
    searchQuestions,
    addHistory, addHistoryFilter
  ]
  // useCallback(setNewQuestion, []), 
  // useCallback(getCurrQuestion, [question]), 
  // useCallback(getNextChatBotAnswer, [question])
}
