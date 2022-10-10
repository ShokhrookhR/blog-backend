
export default (req,res,next) => {
	const postId = (req.headers.postid||'')

	if (postId) {
		try {
		
      req.postId = postId;
      next();
    } catch (error) {
			return res.status(403).json({message: 'Нет доступа'})
		}
	}
}