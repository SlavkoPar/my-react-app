// Define the Global State
import type { IAssignedAnswerDtoKey, IAssignedAnswerKey, IQuestion, IQuestionDtoKey, IQuestionKey } from '../categories/types';
//import { IOption } from 'common/types';

export interface IWhoWhen {
	time: Date,
	nickName: string
}

export interface IRecord {
	created?: IWhoWhen;
	modified?: IWhoWhen;
}

export interface IWhoWhenDto {
	Time: Date,
	NickName: string
}

export interface IDto {
	Created?: IWhoWhenDto;
	Modified?: IWhoWhenDto;
}

export interface IDtoKey extends IDto {
	Workspace?: string; // will be set during fetch
	TopId: string,
	Id: string,
	ParentId?: string;
}

export class Dto2WhoWhen {
	constructor(whoWhenDto?: IWhoWhenDto) {
		if (whoWhenDto) {
			const { Time, NickName } = whoWhenDto;
			this.whoWhen = {
				time: new Date(Time),
				nickName: NickName
			}
		}
	}
	whoWhen?: IWhoWhen = undefined;
}

export class WhoWhen2Dto {
	constructor(whoWhen: IWhoWhen | undefined) {
		if (whoWhen) {
			const { time: date, nickName } = whoWhen;
			this.whoWhenDto = {
				Time: new Date(date),
				NickName: nickName
			}
		}
	}
	whoWhenDto?: IWhoWhenDto = undefined;
}

export interface IChatBotAnswer {
	questionKey?: IQuestionKey;
	topId: string;
	id: string;
	answerTitle: string;
	answerLink: string | null;
	created: IWhoWhen,
	modified: IWhoWhen | null
}

export interface INewQuestion {
	question: IQuestion | null;
	firstAnswer: IChatBotAnswer | null;
	hasMoreAnswers: boolean;
}

export interface INextAnswer {
	nextChatBotAnswer: IChatBotAnswer | null; //undefined;
	hasMoreAnswers: boolean;
}

export interface IHistory {
	id?: number;
	questionKey: IQuestionKey;
	assignedAnswerKey: IAssignedAnswerKey;
	userAction: USER_ANSWER_ACTION; // when client didn't click on 'Fixed' or 'Not fixed' buttons
	created?: IWhoWhen
}


export class HistoryDto {
	constructor(history: IHistory, Workspace: string) {
		const { questionKey, assignedAnswerKey } = history;
		this.historyDto = {
			Workspace,
			QuestionKey: { TopId: questionKey.topId, Id: questionKey.id, ParentId: questionKey.parentId },
			AnswerKey: { TopId: assignedAnswerKey.topId, Id: assignedAnswerKey.id },
			UserAction: history.userAction,
			Created: new WhoWhen2Dto(history.created).whoWhenDto!,
		}
	}
	historyDto: IHistoryDto;
}



// export class History {
// 	constructor(dto: IHistoryDto) {
// 		const { QuestionKey, AnswerKey, UserAction } = dto;
// 		this.history = {
// 			questionKey: { topId: QuestionKey.TopId, id: QuestionKey.Id, parentId: QuestionKey.ParentId },
// 			userAction: UserAction,
// 			assignedAnswerKey: { topId: AnswerKey.TopId, id: AnswerKey.Id }
// 		}
// 	}
// 	history: IHistory;
// }


export interface IAuthUser {
	color?: string,
	nickName: string,
	name: string;
	email?: string,
	role?: ROLES,
	visited?: Date
}

// export const ROLES: Map<string, string> = new Map<string, string>([
// 	['OWNER', 'OWNER'],
// 	['ADMIN', 'ADMIN'],
// 	['EDITOR', 'EDITOR'],
// 	['VIEWER', 'VIEWER']
// ])

export enum ROLES {
	OWNER = 'OWNER',
	ADMIN = 'ADMIN',
	EDITOR = 'EDITOR',
	VIEWER = 'VIEWER'
}


// export interface IShortGroup {
// 	topId: string,
// 	id: string;
// 	parentId: string | null;
// 	header: string;
// 	title: string;
// 	titlesUpTheTree: string; // traverse up the tree, until root
// 	hasSubGroups: boolean;
// 	level: number;
// 	kind: number;
// 	isExpanded: boolean;
// }


export interface IGlobalState {
	isAuthenticated: boolean | null;
	ws: string;
	everLoggedIn: boolean;
	canAdd: boolean,
	isOwner: boolean,
	isDarkMode: boolean;
	variant: string,
	bg: string,
	error?: Error;
}


export interface ILocStorage {
	nickName: string;
	everLoggedIn: boolean;
	isDarkMode: boolean;
	variant: string;
	bg: string;
	lastRouteVisited: string;
}

export interface IParentInfo {
	parentId: string,
	title?: string, // to easier follow getting the list of sub-categories
	level: number
}

export interface IHistoryFilter {
	Workspace?: string,
	questionKey: IQuestionKey;
	filter: string;
	created: IWhoWhen
}

export interface IHistoryFilterDto {
	Workspace?: string,
	QuestionKey: IQuestionDtoKey;
	Filter: string;
	Created: IWhoWhenDto
}


export class HistoryFilterDto {
	constructor(historyFilter: IHistoryFilter, Workspace: string) {
		const { questionKey, filter, created } = historyFilter;
		this.historyFilterDto = {
			Workspace,
			Filter: filter,
			QuestionKey: { Workspace, TopId: questionKey.topId, Id: questionKey.id, ParentId: questionKey.parentId },
			Created: new WhoWhen2Dto(created).whoWhenDto!,
		}
	}
	historyFilterDto: IHistoryFilterDto;
}



export interface ILoginUser {
	nickName: string;
	password?: string;
	who?: string;
}

export interface IRegisterUser {
	who?: string,
	nickName: string,
	name: string,
	password: string,
	email: string,
	color: string,
	level: number,
	confirmed: boolean
}

export interface IJoinToWorkspace {
	invitationId: string,
	userName: string;
	password: string;
	date?: Date;
}


export type ActionMap<M extends Record<string, unknown>> = {
	[Key in keyof M]: M[Key] extends undefined
	? {
		type: Key;
	}
	: {
		type: Key;
		payload: M[Key];
	}
};

export enum GlobalActionTypes {
	SET_LOADING = 'SET_LOADING',
	SET_FROM_LOCAL_STORAGE = "SET_FROM_LOCAL_STORAGE",
	AUTHENTICATE = "AUTHENTICATE",
	UN_AUTHENTICATE = "UN_AUTHENTICATE",
	SET_DBP = "SET_DBP",
	SET_ERROR = 'SET_ERROR',
	DARK_MODE = "DARK_MODE",
	LIGHT_MODE = "LIGHT_MODE",
	SET_ALL_CATEGORY_ROWS = 'SET_ALL_CATEGORY_ROWS',
	SET_ALL_GROUP_ROWS = 'SET_ALL_GROUP_ROWS',
	SET_NODES_RELOADED = 'SET_NODES_RELOADED',
	SET_QUESTION_AFTER_ASSIGN_ANSWER = 'SET_QUESTION_AFTER_ASSIGN_ANSWER',
	SET_LAST_ROUTE_VISITED = 'SET_LAST_ROUTE_VISITED'
}

export type GlobalPayload = {
	[GlobalActionTypes.SET_LOADING]: object;

	[GlobalActionTypes.SET_FROM_LOCAL_STORAGE]: {
		locStorage: ILocStorage
	};


	[GlobalActionTypes.AUTHENTICATE]: {
		user: IUser
	};

	[GlobalActionTypes.UN_AUTHENTICATE]: undefined;


	[GlobalActionTypes.SET_ERROR]: {
		error: Error;
	};

	[GlobalActionTypes.LIGHT_MODE]: undefined;

	[GlobalActionTypes.DARK_MODE]: undefined;


	[GlobalActionTypes.SET_NODES_RELOADED]: undefined;

	[GlobalActionTypes.SET_QUESTION_AFTER_ASSIGN_ANSWER]: {
		question: IQuestion
	};

	[GlobalActionTypes.SET_LAST_ROUTE_VISITED]: {
		lastRouteVisited: string
	};
};





////////////////////////
// Category -> questions
export interface IQuestionData {
	title: string;
	assignedAnswers?: number[];
	source?: number;
	status?: number;
	variations?: string[]
}

export interface ICategoryData {
	id: string;
	title: string;
	kind?: number;
	variations?: string[];
	categories?: ICategoryData[],
	questions?: IQuestionData[]
}


////////////////////
// Group -> answers
export interface IAnswerData {
	title: string;
	source?: number;
	status?: number;
}

export interface IGroupData {
	id: string,
	title: string,
	groups?: IGroupData[],
	answers?: IAnswerData[]
}

////////////////////
// Role -> users


export interface IUserData {
	nickName: string;
	name: string;
	password: string;
	email: string;
	color: string;
}

export interface IRoleData {
	title: string,
	roles?: IRoleData[],
	users?: IUserData[]
}

export type USER_ANSWER_ACTION = 'NotFixed' | 'Fixed' | 'NotClicked';

export interface IHistory {
	id?: number;
	questionKey: IQuestionKey;
	assignedAnswerKey: IAssignedAnswerKey;
	userAction: USER_ANSWER_ACTION; // when client didn't click on 'Fixed' or 'Not fixed' buttons
	created?: IWhoWhen
}

export interface IHistoryDto {
	Workspace: string,
	PartitionKey?: string;
	Id?: number;
	QuestionKey: IQuestionDtoKey;
	AnswerKey: IAssignedAnswerDtoKey;
	UserAction: USER_ANSWER_ACTION; // when client didn't click on 'Fixed' or 'Not fixed' buttons
	Created: IWhoWhenDto
}

export interface IHistoryFilterDto {
	QuestionKey: IQuestionDtoKey;
	Filter: string;
	Created: IWhoWhenDto
}


export interface IHistoryDtoEx {
	historyDto: IHistoryDto | null;
	msg: string;
}

export interface IHistoryDtoListEx {
	historyDtoList: IHistoryDto[];
	msg: string;
}

export interface IHistoryListEx {
	historyList: IHistory[];
	msg: string;
}


export interface IHistoryData {
	client: string;
	questionId: number;
	answerId: number;
	created?: Date
}


export interface IUser {
	workspace: string;
	nickName: string;
	name: string;
	color?: string;
	level?: number;
	isDarkMode?: boolean;
}

export type GlobalActions = ActionMap<GlobalPayload>[keyof ActionMap<GlobalPayload>];

