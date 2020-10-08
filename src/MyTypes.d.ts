import { StateType, ActionType } from 'typesafe-actions';

declare module 'MyTypes' {
  export type Store = StateType<typeof import('./index')>;
  export type RootAction = ActionType<typeof import('./redux/actions/actions')>;
  export type RootState = StateType<ReturnType<typeof import('./redux/reducers/chatReducer').default>>;
}

declare module 'typesafe-actions' {
  
    export type RootAction = ActionType<typeof import('./redux/actions/actions')>;

}