const fetch = require("fetch");

async function getData() {
  const apiUrl = "http://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=ssq&issueCount=100";

  return new Promise((resolve, rej) => {
    fetch.fetchUrl(apiUrl, (error, meta, body) => {
      if (error) {
        rej(error);
        return;
      }
      resolve(body.toString());
    });
  });
}

function Compare(val){ 
  return function(a,b){  
    return b[val] - a[val];    
  }
}

function countNumber(arr) {
  return arr.reduce((all, item) => {
    const keys = all.map(i => i.number);
    if (keys.includes(item)) {
      const curItem = all.filter(i => i.number === item)[0];
      curItem.times += 1
    } else {
      all.push({
        "number": item,
        "times": 1
      })
    }

    const sorted = all.sort(Compare('times'));  

    return sorted;
  }, []);
}

async function main() {
  const res = await getData();
  const data = JSON.parse(res).result;
  const red = data.reduce((acc, cur) => acc += cur.red + ',', '').split(',').filter(Boolean);
  const blue = data.reduce((acc, cur) => acc += cur.blue + ',', '').split(',').filter(Boolean);

  const countRed = countNumber(red);
  const countBlue = countNumber(blue);

  const recommendRed = countRed.slice(0, 7).reduce((acc, cur) => [...acc, cur.number], []);
  const recommendBlue = countBlue.slice(0, 2).reduce((acc, cur) => [...acc, cur.number], []);

  const recommend = {
    "red": recommendRed,
    "blue": recommendBlue
  }

  console.log(countRed);
  console.log(countBlue);
  console.log(recommend);

  return {
    countRed,
    countBlue,
    recommend
  }
}

module.exports = main;