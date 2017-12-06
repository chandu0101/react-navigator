import { Component, createElement } from 'react'
import { RouterCtrl } from './routerCtrl'

// export type Props2<Params> = { id: string; p?: Params };

// export class Test extends Component<Props2<{}>, {}> {
//   constructor(props: Props2<{}>) {
//     super(props);
//   }

//   render() {
//     return "Hello";
//   }
// }

export type RouterScreenProps = Readonly<{ navigation: RouterCtrl }>

export abstract class RouterScreenComponent<Params, S, LS> extends Component<
  RouterScreenProps,
  S
> {
  params?: Params
  locationState?: LS
  navigation: RouterCtrl = this.props.navigation
}

export const navigationContext = { navigation: 'Object' }

// export class Test2 extends RouterScreenComponent<{}, Props2<{}>, {}> {
//   // constructor(props: RouterScreenProps) {
//   //   super(props);
//   // }
//   render() {
//     return "Hello";
//   }
// }

// function myFunction<
//   P,
//   S,
//   C extends new (props: RouterScreenProps) => RouterScreenComponent<
//     {},
//     Props2<{}>,
//     S
//   >
// >(c: C): void {
//   console.log("ctor", c);
// }

// const s = myFunction(Test2);
