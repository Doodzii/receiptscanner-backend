import { createWorker } from "tesseract.js";

//const { createWorker } = require('tesseract.js');

const ReadText = (imgfile : any, oem: any, psm: any) => {

    const oem_var = oem || 2
    const psm_var = psm || 3

    try {
        return new Promise((resolve, reject) => {
            const worker = createWorker();
            worker.load().then(() => {
                worker.loadLanguage('eng+osd').then(() => {
                    worker.initialize('eng+osd').then(() => {
                        worker.setParameters({
                            tessedit_ocr_engine_mode: oem_var,
                            tessedit_pageseg_mode: psm_var,
                            // tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
                        }).then(() => {
                            worker.recognize(imgfile, {
                                // tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
                            }).then(({ data: { text } }) => {
                                // console.log(text)
                                resolve(text)
                            }).finally(() => {
                                worker.terminate()
                            })
                        })
                    });
                })
            })

        });

    }
    catch (e) {
        return `An error occurred: ${e}`
    }
}

const ScanImage = async(buffer : String) => {
    
    
    const worker = await createWorker();
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    
    const result = await worker.recognize(buffer as any);

    console.log(result.data.text);
    worker.terminate();
}

export default {
    ScanImage
}
