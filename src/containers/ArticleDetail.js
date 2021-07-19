import { useParams } from "react-router-dom";

const getArticleQueryId = (id) => {
    var strArr = id.split("-");
    return strArr[strArr.length - 1];
}

const ArticleDetail = (props) => {
    const {articleId} = useParams();
    const id = getArticleQueryId(articleId)
    console.log(id);
    return(
        <div>articel detail</div>
    );
};

export default ArticleDetail;