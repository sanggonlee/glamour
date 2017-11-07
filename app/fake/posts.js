const platforms = ['PS4', 'XBox', 'PC', 'Nintendo DS'];

function generatePosts(num) {
  const indices = [...Array(num).keys()];
  return indices.map(i => ({
    id: `p${i}`,
    gameId: `g${i}`,
    gameName: `Game ${i}`,
    platform: platforms[i % platforms.length],
    distance: `${i}km from you`
  }));
};

const posts = generatePosts(10);

export default posts;