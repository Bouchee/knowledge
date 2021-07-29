var the_numeric = require('../numeric/src/numeric')
var numeric = the_numeric.numeric;

//     function matrix(m, n) {
//     var result = []
//     for(var i = 0; i < n; i++) {
//         result.push(new Array(m).fill(0))
//     }
//     return result
// }
// function get_judgement_matrix(scores=[]) {
//     // get judgement matrix  according to personal score.
//     // :param scores: a list, the item is the score range 1 to 10 means the importance of each sub-indicator.
//     // :return: judgement matrix, item range 1 to 9.
// 	//
//     // - more: in judgement matrix:
//     // 1 means two sub-indicators are the same important.
// 	//
//     // 3 means the first sub-indicator is a little important than another one.
// 	//
//     // 5 means the first sub-indicator is apparently important than another one.
// 	//
//     // 7 means the first sub-indicator is strongly significant than another one.
// 	//
//     // 9 means the first sub-indicator is extremely significant than another one.
// 	//
//     // and 2, 4, 6, 8 are in the middle degree.
// 	//  # 评分1——10
//     length = scores.length
//     array = [[1,3,2,5,5,7],[0.3333,1,0.5,5,4,5],[0.5,2,1,6,6,7],[0.2,0.2,0.1667,1,2,2],[0.2,0.25,0.1667,0.5,1,3],[0.1429,0.2,0.1429,0.5,0.3333,1]];
// 	return array
// }

function get_tezheng(array=[]) {

    // get the max eigenvalue and eigenvector
    // :param array: judgement matrix
    // :return: max eigenvalue and the corresponding eigenvector

    // 获取最大特征值和对应的特征向量


    res2 = numeric.eig(array)
    //特征值数组
    list1=res2.lambda.x
    //最大特征值
    max_val=0
    for(i=0;i<list1.length;i++){
        if(list1[i]>max_val)
            max_val=list1[i]
    }

	index=list1.indexOf(max_val)
	te_vector=res2.E.x
    te_vector=numeric.transpose(te_vector)
	max_vector=te_vector[index]

	//返回最大特征值与特征向量
    return max_val, max_vector


}
function RImatrix(n=0) {

    // get RI value according the the order
    // :param n: matrix order
    // :return: Random consistency index RI of a n order matrix

    n1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    n2 = [0, 0, 0.52, 0.89, 1.12, 1.26, 1.36, 1.41, 1.46, 1.49, 1.52, 1.54, 1.56, 1.58, 1.59, 1.60]
	index=n1.indexOf(n)
	return n2[index]
}
function consitstence(max_val, RI, n){

    // use the CR indicator to test the consistency of a matrix.
    // :param max_val: eigenvalue
    // :param RI: Random consistency index
    // :param n: matrix order
    // :return: 1 or 0, denotes whether it meat the validation of consistency

    CI = (max_val - n) / (n - 1)
    if (RI == 0){
    	return 1
	}
    else{
    	CR = CI / RI
	}
	if (CR<0.1){
		return 1
	}
	else{
		return 0
	}
}
function normalize_vector(max_vector=[]) {

    // normalize the vector, the sum of elements is 1.0
    // :param max_vector: a eigenvector
    // :return: normalized eigenvector

    vector = []
	vector_after_normalization=[]
	sum0=0
	for(i=0;i<max_vector.length;i++){
		vector.push(max_vector[i])
		sum0+=max_vector[i]
	}
	for(i=0;i<max_vector.length;i++){
		vector_after_normalization.push(vector[i] / sum0)
	}
    return vector_after_normalization
}
function getWeight(array){

    // get weight vector according to personal score.
    // :param score: a list, the item is the score range 1 to 10 means the importance of each sub-indicator.
    // :return: a list, the item is the weight range 0.0 to 1.0.
    n = array.length
    max_val=0
    max_vector=0
    max_val, max_vector = get_tezheng(array)
    RI = RImatrix(n)
    if (consitstence(max_val, RI, n) == 1){
    	feature_weight = normalize_vector(max_vector)
        return feature_weight
	}
	else{
		return [1 / n] * n
	}
}
module.exports = {
    AHP:{
        getWeight:getWeight,
    }
}
