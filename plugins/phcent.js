/**
 * 生成树
 * @param list
 * @param keyCol
 * @param keyVal
 * @returns {[]}
 */
function getNodes(list,keyCol,keyVal){
  const newList = [];
  list.forEach(item=>{
    if(item[keyCol] === keyVal){
      newList.push(item);
    }
  });
  return newList;
}

/**
 * 生成树
 * getTree(array,'pid',0,'id','pid');
 * @param list 二维数组
 * @param keyCol 区分字段
 * @param keyVal 区分值
 * @param idCol 主键
 * @param pidCol 父节点字段
 * @returns {[]}
 */
export function getTree(list,keyCol,keyVal,idCol,pidCol){
  const newList = [];
  if(keyVal != null && list && list instanceof Array && list.length > 0){
    const parentNodes = getNodes(list,keyCol,keyVal);
    parentNodes.forEach(item=>{
      const childrenList = getTree(list,pidCol,item[idCol],idCol,pidCol);
      if(childrenList?.length > 0){
        item.children =  childrenList;
      }
      newList.push(item);
    })
  }
  return newList;
}
