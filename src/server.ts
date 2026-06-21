import app from "./app"

const PORT =process.env.PORT || 5000
const main =()=>{
       try {
         app.listen(PORT,()=>{
              console.log(`Server is running on port ${PORT}`)
         })
       } catch (error) {
            console.log("Error starting the server:",error);
       }
}
main()