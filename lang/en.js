export default (context) => {
  return new Promise(function (resolve) {
    resolve({
      intro: {
        welcome: 'Player\'s Manual - Introduction'
      },
      nav: {
        changelog: 'Changelog',
        feedback: 'Feedback'
      }
    })
  });
}
