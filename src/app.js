import express from "express";
import morgan from "morgan";
import cors from "cors";
// Routes
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import allergenRoutes from "./routes/allergen.routes";
import productAllergenRelRoutes from "./routes/productAllergenRel.routes";
import requestLineRoutes from "./routes/requestLine.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes"
import AppMidlewares from "./middlewares/app.middleware"

const app=express();

//settings (configuraciones)
app.set ("port", 4000);

//Middleware (intermediarios): operaciones intermedia que se realizan antes de ejecutar la información. 
    //Generalmente son temas de seguridad o comprobación y se usa cuando es susceptible de ser usado de forma mas o menos generica.
app.use(morgan("dev"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use(AppMidlewares.authApp);

//Routes
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", allergenRoutes);
app.use("/api", productAllergenRelRoutes);
app.use("/api", requestLineRoutes);
app.use("/api", userRoutes);
app.use("/api", authRoutes);




export default app;