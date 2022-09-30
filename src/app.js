const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
// Routes
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const allergenRoutes = require("./routes/allergen.routes");
const productAllergenRelRoutes = require("./routes/productAllergenRel.routes");
const orderLineRoutes = require("./routes/orderLine.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const imageRoutes = require("./routes/image.routes");
const AppMidlewares = require("./middlewares/app.middleware");

const appMiddleware = new AppMidlewares();
const app = express();

//settings (configuraciones)
app.set("port", 4000);

//Middleware (intermediarios): operaciones intermedia que se realizan antes de ejecutar la información. 
//Generalmente son temas de seguridad o comprobación y se usa cuando es susceptible de ser usado de forma mas o menos generica.
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
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




module.exports = app;