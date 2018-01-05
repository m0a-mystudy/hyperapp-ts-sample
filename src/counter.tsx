import { h, app } from "hyperapp"

const state = {
  count: 0
}

interface State {
    count: number;
}

const actions = {
  down: () => (state:State) => ({ count: state.count - 1 }),
  up: () => (state: State) => ({ count: state.count + 1 })
}
type Actions = typeof actions
const view = (state: State, actions: Actions) => (
  <main>
    <h1>{state.count}</h1>
    <button onclick={actions.down}>-</button>
    <button onclick={actions.up}>+</button>
  </main>
)

export const main = app(state, actions, view, document.body)
