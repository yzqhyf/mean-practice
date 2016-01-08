var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	body: String,
	author: String,
	upvotes: {type: Number, default: 0},
	post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});

CommentSchema.methods.commentUpvote = function(comment) {
	console.log("in CommentSchema");
	this.upvotes += 1;
	this.save(comment);
};

mongoose.model('Comment', CommentSchema);