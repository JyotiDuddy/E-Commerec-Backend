const mongoose = require("mongoose");

const CarouselSchema  = new mongoose.Schema({
  image:{
    type:String,
    required:true
  },
  title:{
    type:String,
    required:true,
  },
type:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"ProductType",
  required:true
},
shortDescription:{
  type:String,
  required:true
}
},{
_id:false
})

const QuickPickSchema= new mongoose.Schema({
image:{
   type:String,
   required:true

  },
  title:{
    type:String,
    required:true,
  },
shortDescription:{
  type:String,
  required:true,
},
filterBy:{
  type:String,
  required:true,
        enum: [
        "new_arrival",
        "under_999",
        "best_seller",
        "festival_offer",
        "under_499",
      ],

}
},{
  _id:false
})

const SpecialOfferSchema=new mongoose.Schema({
  image:String,
  title:String,
  description:String,
  tags:{
    type:[String],
    default:[]
  },
},{
  _id:false
});

const HomePageSchema= new mongoose.Schema({
  carousel:{
    type:[CarouselSchema],default:[]
  },
  quickPicks:{
    type:[QuickPickSchema],default:[]
  },
specialOffer: {
  type: SpecialOfferSchema,
  default: () => ({
    image: "",
    title: "",
    description: "",
    tags: [],
  }),
},

  // Visibilty Flags
  showTypes:{type:Boolean,default:true},
  showCarousel:{type:Boolean,default:true},
  showQuickPicks:{type:Boolean,default:true},
  showTopSelling:{type:Boolean,default:true},
  showTopRated:{type:Boolean,default:true},
  showSpecialOffer:{type:Boolean,default:true},
  showNotifySection:{type:Boolean,default:true},
  showTestimonial:{type:Boolean,default:true},
  showAdSection:{type:Boolean,default:true},
  isActive:{type:Boolean,default:true},
},{
  timestamps:true
});

HomePageSchema.pre("save", async function () {
  if (this.isActive) {
    await this.constructor.updateMany(
      {
        _id: { $ne: this._id },
      },
      {
        $set: {
          isActive: false,
        },
      }
    );
  }
});

const HomePage= mongoose.model("HomePage",HomePageSchema);

module.exports= HomePage;