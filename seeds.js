const faker = require('faker');
const Post = require('./models/posts');
const cities = require('./cities');

async function seedPosts() {
	await Post.deleteMany({});
	for(const i of new Array(200)) {
		const random1000 = Math.floor(Math.random() * 1000);
		const random5 = Math.floor(Math.random() * 6);
		const title = faker.lorem.word();
		const description = faker.lorem.text();
		const postData = {
			title,
			description,
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			geometry: {
				type: 'Point',
				coordinates: [cities[random1000].longitude, cities[random1000].latitude],
			},
			author:"5d24d1efe9bde80dcc324145",
			price:random1000,
			averageRating:random5,
			images:[{url:faker.random.image()},{url:faker.random.image()}]
		}
	
		let post = new Post(postData);
		post.properties.description = `<strong><a href="/posts/${post._id}">${title}</a></strong><p>${post.location}</p><p>${description.substring(0, 20)}...</p>`;
		await post.save();
	}
	console.log('200 new posts created');
}

module.exports = seedPosts;