import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";

const app: Express = express();
app.use(cors());
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));
const server = http.createServer(app);
const io = new Server(server);

dotenv.config();
const port = process.env.port;

var jsonParser = bodyParser.json();


//GOOGLE STUFF
import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient();

const detectText = async(buffer : String) => {
    return new Promise(fulfil => {
        const request : Object = {
            image: {
                content: buffer
            }
        }
        client.textDetection(request)
            .then((result : any) => {
                //fulfil(result[0].fullTextAnnotation.text)
                //console.log(result[0].fullTextAnnotation.pages[0]);

                result[0].fullTextAnnotation.pages[0].blocks[0].forEach((paragraph : any) => {
                    

                    paragraph[0].forEach((word : any) => {
                        word[0].forEach((symbol : any) => {
                            console.log(symbol.text);
                        })
                    })


                    //console.log(`${element} \n\n\n`)
                });



                fulfil(result[0])
            })
            .catch(error => {
                fulfil(error);
            });
    })
}

const getPrice = async(texts : Array<String>) => {
    let highest = 0;

    texts.forEach(text => {
        let matches = text.match("[0-9]+(,|\\.)[0-9]+");
        if (matches) {
            let text = matches[0].replace(",", ".");
            let amount = Number.parseFloat(text);
            
            if (amount > highest) {
                highest = amount;
            }
        }
    })

    console.log(`The amount scanned is:\n${highest} kroner`);
    return highest;
}




//Playground

app.get("/", (req, res) => {
    res.send("Hej!");
})

app.post("/scanPhoto", jsonParser, async(req, res) => {
    console.log("\nRECEIVED IMAGE!\n");

    const buffer = req.body.image.split(",")[1];
    const text = await detectText(buffer) as any;
    //if (!text) return;
    //const amount = getPrice(text.split("\n"))

    res.send(text);
})


io.on("connection", (socket) => {
    console.log("new socket connection!");
})

io.on("test", (Socket) => {

    console.log("socket test !!!!!!!")

})


server.listen(port, () => {
    console.log(`Server is now running at http://localhost:${port}/`);
})
