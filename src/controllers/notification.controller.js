const Notification= require("../models/notification.model")

const getUnreadCount= async(req,res)=>{
try{

const totalUnread = await Notification.countDocuments({
    isRead: false
});

  const newOrder = await Notification.countDocuments({
    type:"NEW_ORDER",
    isRead:false,
  });

    const newEnquiry = await Notification.countDocuments({
    type:"NEW_ENQUIRY",
    isRead:false,
  })
    const lowStock = await Notification.countDocuments({
    type:"LOW_STOCK",
    isRead:false,
  })

  res.status(200).json({
    success:true,
    totalUnread,
    breakdown:{
      NEW_ORDER:newOrder,
      NEW_ENQUIRY: newEnquiry,
      LOW_STOCK:lowStock

    }
  })
}catch(err){
   res.status(500).json({
      success: false,
      message: err.message,
    }); 
}

}


const getAllNotification= async(req,res)=>{
  try{
  const{page=1,limit=10,isRead} = req.query

  const filter={};

  if(isRead === "true"){
    filter.isRead=true
  }
    if(isRead === "false"){
    filter.isRead=false
  }

  const currentPage= Number(page);

  const perPage= Number(limit);

  const skip= (currentPage-1)*perPage;

  const notification = await Notification.find(filter).sort({
    createdAt:-1
  }).skip(skip).limit(perPage);

  const totalDocs= await Notification.countDocuments(filter);

  const totalPages= Math.ceil(totalDocs/perPage);

  res.status(200).json({
      success: true,
      count: notification.length,
    notifications:notification,
      totalDocs,
      totalPages,
      page: currentPage,
      hasNextPage: currentPage < totalPages,
      limit:perPage,
      hasPrevPage: currentPage > 1,


    })
  }catch(err){
     res.status(500).json({
      success: false,
      message: err.message,
    });
  }



}

const markSingleRead= async(req,res)=>{
  try{
  const notify= await Notification.findById(req.params.id);

  if(!notify){
    return res.status(404).json({
      success:false,
      message:"Notification not found by this id"
    })
  }

  notify.isRead= true;

  await notify.save();

res.status(200).json({
  success: true,
  message: "Notification marked as read",
  notification: notify,
});
  }catch(err){
     res.status(500).json({
      success: false,
      message: err.message,
    });
  }

}

const markAllRead = async (req, res) => {
  try {

    await Notification.updateMany(
      { isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports={getAllNotification,getUnreadCount,markSingleRead,markAllRead}
