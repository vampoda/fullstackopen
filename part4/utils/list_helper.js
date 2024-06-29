const _=require("lodash")
const dummy=()=>{
    return 1
}

const totalLikes=(blogs)=>{
    const blogsLikes=blogs.map(blog=>blog.likes);
    const reducer=(sum,likes)=>sum+likes
const total=blogsLikes.reduce(reducer,0)
return total
}


const favouriteBlog=(blogs)=>{
    const blogsLikes=blogs.map(blogs=>blogs.likes)
    const largestIndex=blogsLikes.indexOf(Math.max(...blogsLikes))
    const largestInfo=blogs[largestIndex]
    return {
		title: largestInfo.title,
		author: largestInfo.author,
		likes: largestInfo.likes,
	}
}
const mostBlogs = (blogs) => {
	const blogsAuthor = blogs.map(blogs => blogs.author)
	
	let mode = 
		_.chain(blogsAuthor)
			.countBy()
			.entries()
			.maxBy(_.last)
			.thru(_.head)
			.value();

	let count = 0;

	blogsAuthor.forEach(element => {
  		if (element === mode) {
    	count += 1;
		}
	})
	
	return {
		author: mode,
		blogs: count,
	}
}
const mostLikes=(blogs)=>{
    const groupedBlogs=_.groupBy(blogs,"author")
    const countedAuthors=_.map(groupedBlogs,(arr,author)=>{
        return{
            author:author,
            likes:_.sumBy(arr,"likes"),
        };
    });
    const maxLikesAuthor=_.maxBy(countedAuthors,"likes")
return maxLikesAuthor


}
module.exports={
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}
