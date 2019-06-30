export default function (context) {
  context.store.dispatch('setDev', context.isDev)
}
