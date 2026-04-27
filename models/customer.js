const mongoose = require("mongoose");
const {Schema} = mongoose

main()
.then(() => console.log("connection suceessful") )
.catch((err) => console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/relationdemo');
}

const orderSchema =  new Schema({
    item:String,
    price: Number,
}); 

const customerSchema = new Schema ({
    name :String,
    orders:[
        {
            type: Schema.Types.objectId,
            ref:"Order",
        },
    ],
}) ;

const Order =mongoose.model("Order", orderSchema);
const Customer = mongoose.model("Customer", customerSchema);

//function
const findCustomer = async ()=> {
    let result  = await Customer.find({}).populate("orders");
    console.log(result[0]);
};

const addcust =async () =>{
    let newcust = new customer({
      name:"karan arjun",  
    });
    let newOrder = new order({
        item:"burger",
        price:250,
    });
    newcust.orders.push(newOrder);
    await newOrder.save();
    await newcust.save();

    console.log("added new customer");
};

const delCust = async() => {
    let data = await Customer.findByIdAndDelete();
    console.log(data);
}
delCust();
addcust();