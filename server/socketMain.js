// const mongoose = require('mongoose')
// mongoose.connect('mongodb://127.0.0.1/perfData', {useNewUrlParser: true});

function socketMain(io, socket){
    // console.log("A socket connectd!", socket.id)

  socket.on('connect', () => {
    console.log('client connected');
  });

  socket.on('disconnect',()=>{
      
  });
};

module.exports = socketMain;
