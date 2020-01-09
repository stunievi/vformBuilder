export default function createStoreModule() {
  return {
    namespaced: true,
    state: {
      data: []
    },
    mutations: {
      replace(state, payload) {
        state.data = payload
      }
    }
  }
}
