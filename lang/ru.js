export default (context) => {
  return new Promise(function (resolve) {
    resolve({
      intro: {
        welcome: 'ru Player\'s Manual - Introduction'
      },
      nav: {
        changelog: 'ru Changelog',
        feedback: 'ru Feedback'
      }
    })
  });
}
