import express from "express";
import morgan from "morgan";
import cors from "cors";
// Routes
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import allergenRoutes from "./routes/allergen.routes";
import productAllergenRelRoutes from "./routes/productAllergenRel.routes";
import orderLineRoutes from "./routes/orderLine.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes"
import imageRoutes from "./routes/image.routes"
import AppMidlewares from "./middlewares/app.middleware"

const appMiddleware = new AppMidlewares();
const app=express();

//settings (configuraciones)
app.set ("port", 4000);

//Middleware (intermediarios): operaciones intermedia que se realizan antes de ejecutar la información. 
    //Generalmente son temas de seguridad o comprobación y se usa cuando es susceptible de ser usado de forma mas o menos generica.
app.use(morgan("dev"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

//Routes
app.use("/images", imageRoutes);
app.use("/api", [appMiddleware.authApp.bind(appMiddleware)], productRoutes);
app.use("/api", [appMiddleware.authApp.bind(appMiddleware)], orderRoutes);
app.use("/api", [appMiddleware.authApp.bind(appMiddleware)], allergenRoutes);
app.use("/api", [appMiddleware.authApp.bind(appMiddleware)], productAllergenRelRoutes);
app.use("/api", [appMiddleware.authApp.bind(appMiddleware)], orderLineRoutes);
app.use("/api", [appMiddleware.authApp.bind(appMiddleware)], userRoutes);
app.use("/api", [appMiddleware.authApp.bind(appMiddleware)], authRoutes);




export default app;