/*const app = require("express")()
const PORT = 3000
app.get('/',(req,res)=>{
res.send("Hello World")
})
app.get("/hello",(req,res)=>{
res.send("Hello");
});
app.listen(PORT,()=>{
console.log(`Listening @ ${PORT}`)
});

function requestPathLogger(req,res) {
    console.log(`REQ PATH: ${req.path}`)
    }

    app.get('/',requestPathLogger,(req,res)=>{
        res.send("Hello World")
        })
        app.get("/hello",requestPathLogger,(req,res)=>{
        res.send("Hello");
        });
  */      

        const registerServiceWorker = async () => {
            if ("serviceWorker" in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register("/sw.js", {
                        scope: "/",
                    });
                    if (registration.installing) {
                        console.log("Service worker installing");
                    } else if (registration.waiting) {
                        console.log("Service worker installed");
                        //window.location.reload(); // Bad idea ???
                    } else if (registration.active) {
                        console.log("Service worker active");
                    }
                } catch (error) {
                    console.error(`Registration failed with ${error}`);
                }
            }
        };
        
        registerServiceWorker();