import { useCallback, useState } from "react";
import { Question, QuestionKey, type IQuestionDtoEx, type IQuestionEx, type IQuestionKey, type IQuestionRow, type IQuestionRowDto, type IQuestionRowDtosEx } from "../categories/types";
import { HistoryDto, HistoryFilterDto, type IHistory, type IHistoryDto, type IHistoryDtoEx, type IHistoryFilter } from "../global/types";
import { protectedResources } from "../global/authConfig";


export const useData = (): [
  (questionKey: IQuestionKey) => Promise<IQuestionEx>,
  (filter: string, count: number) => Promise<IQuestionRow[]>,
  (history: IHistory) => Promise<void>,
  (historyFilter: IHistoryFilter) => Promise<void>,
] => {

  const [workspace, setWorkspace] = useState("DEMO");

  const Execute = async (method: string, endpoint: string, data: object | null = null): Promise<object> => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        console.log({ accessToken })
        let response = null;

        const headers = new Headers();
        const bearer = `Bearer ${accessToken}`;
        headers.append("Authorization", bearer);

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

  const getQuestion = async (questionKey: IQuestionKey): Promise<IQuestionEx> => {
    return new Promise((resolve) => {
      try {
        const { topId, id } = questionKey;
        const query = new QuestionKey(questionKey).toQuery(workspace);
        const url = `${protectedResources.KnowledgeAPI.endpointQuestion}?${query}`;
        console.time()
        Execute("GET", url)
          .then((value: object): void => {
            const x: IQuestionDtoEx = value as IQuestionDtoEx;
            console.timeEnd();
            const { questionDto, msg } = x;
            if (questionDto) {
              const questionEx: IQuestionEx = {
                question: new Question(questionDto).question,
                msg
              }
              resolve(questionEx);
            }
            else {
              const questionEx: IQuestionEx = {
                question: null,
                msg
              }
              resolve(questionEx);
            }
            //}
          });
      }
      catch (error: unknown) {
        console.log(error);
        const questionEx: IQuestionEx = {
          question: null,
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
            console.log('questionRowDtos:', { dtos: dtosEx }, protectedResources.KnowledgeAPI.endpointCategory);
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

  const addHistory = useCallback(
    async (history: IHistory): Promise<void> => {
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
    }, [workspace]);


  const addHistoryFilter = useCallback(async (historyFilter: IHistoryFilter): Promise<void> => {
    //const { topId, id, variations, title, kind, modified } = history;
    //dispatch({ type: ActionTypes.SET_CATEGORY_LOADING, payload: { id, loading: false } });
    try {
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

  return [getQuestion, searchQuestions, addHistory, addHistoryFilter]
  // useCallback(setNewQuestion, []), 
  // useCallback(getCurrQuestion, [question]), 
  // useCallback(getNextChatBotAnswer, [question])
}
