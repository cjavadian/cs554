/*
* Catherine Javadian
* CS 546
* Lab 7
* I pledge my honor that I have abided by the Stevens Honor System.
*/

const dbConnection = require("./mongoConnection");

const getCollectionFn = collection => {
	let _col = undefined;
	
	return async () => {
		if (!_col) {
			const db = await dbConnection();
			// db.dropDatabase(); deletes database
			_col = await db.collection(collection);
		}
		return _col;
	};
};

module.exports = {
    tasks: getCollectionFn("tasks"),
};