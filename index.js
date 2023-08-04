const fs = require("fs");
const http = require('http');
const url = require('url');

const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');
const { toUnicode } = require("punycode");

//Blocking synchronous way
// const text = fs.readFileSync('./txt/input.txt', 'utf-8');

// console.log(text);

// const textOut = `this what i call a avacado${text}.\nCreated in${Date.now()}`;

// fs.writeFileSync('./txt/output.txt',textOut);
// console.log('file written');

//Non-Blocking , asynchronous way

// fs.readFile('./txt/start.txt','utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err, data2) => {
//         console.log(data2);    
//     });
// });

// console.log ('1st read this:');

// SERVER

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower:true}));
console.log(slugs);


const server = http.createServer((req, res) => {

    
    // console.log(url.parse(req.url, true));
    // const pathName = req.url;

    const { query, pathname} = url.parse(req.url, true);
    
//overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type':'text/html'});

      const cardsHtml =  dataObj.map(el => replaceTemplate(tempCard,el)).join('');

      const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);

        res.end(output);
        
        // produdct page
    }else if(pathname === '/product'){
        // console.log(query);
        // res.end('this is product');

        res.writeHead(200, {'Content-type':'text/html'});
        const product = dataObj [query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);


        //API call
    }else if(pathname === '/api'){
       res.writeHead(200, {'Content-type':'application/json'});
       res.end(data);     

    }

    //Not found
    else{
        res.writeHead(404, {
            "Content-Type": "text/html",
            "my-own-head": "hello-biatches"
        });
        res.end('<h1>Page not Found!!</h1>');
    }
});

server.listen(7000,'127.0.0.1', () =>{
    console.log('server started at port 7000');
});