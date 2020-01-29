const config = require('./config');

const SerialPort = require('serialport')
const express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(__dirname + '/public'));
http.listen(config.port, () => console.log('listening on port ' + config.port))


const serialPort = new SerialPort(config.serialPort, {
    baudRate: 9600, 
    dataBits: 8,
    stopBits: 1 
})

let authenticatedSockets = {}


serialPort.on('open', () => {



    io.on('connection', socket => {
        console.log('utente connesso')
        authenticatedSockets[socket.id] = socket
    
        socket.on('disconnect', () => {
            console.log('utente disconnesso')
            delete authenticatedSockets[socket.id]
        })
    })


    

})
const ByteLength = require('@serialport/parser-byte-length')


const parser = serialPort.pipe(new ByteLength({length: 2}))

parser.on('data', data => {

    //

    switch(data[0]){
        case 0xA2:
            for(let socketid in authenticatedSockets){
                authenticatedSockets[socketid].emit('ecg', data[1])
            }
            break;
        case 0xA1:{
            let touch = {}
            let fall
            let movement
            let b = data[1]

            if(b & 1){
                touch.chest = true
            }
            else touch.chest = false


            if(b & 2){
                touch.arm = true
            }
            else touch.arm = false


            if(b & 4){
                touch.abdomen = true
            }
            else touch.abdomen = false


            if(b & 8){
                touch.rkidney = true
            }
            else touch.rkidney = false

            if(b & 16){
                touch.lkidney = true
            }
            else touch.lkidney = false

            if(b & 64){
                fall = true
            }
            else fall = false
            if(b & 128){
                movement = true
            }
            else movement = false
            

            for(let socketid in authenticatedSockets){
                authenticatedSockets[socketid].emit('touch', touch)
                authenticatedSockets[socketid].emit('fall', fall)
                authenticatedSockets[socketid].emit('movement', movement)
            }

        }
        break;

        case 0xA3:{
            console.log(data)
            let temp = Math.trunc(data[1] / 16) + 30 + (data[1] - Math.trunc(data[1] / 16) * 16) * 0.1
            for(let socketid in authenticatedSockets){
                authenticatedSockets[socketid].emit('temp', temp)
            }
        }
        break;


        case 0xA4:{
            let bpm = data[1]
            for(let socketid in authenticatedSockets){
                authenticatedSockets[socketid].emit('bpm', bpm)
            }
     
        }
        break;


        case 0xA5:{
            let spo2 = data[1]
            for(let socketid in authenticatedSockets){
                authenticatedSockets[socketid].emit('spo2', spo2)
            }
     
        }
        break;

        case 0xA7:{
            let battery = data[1]
            for(let socketid in authenticatedSockets){
                authenticatedSockets[socketid].emit('battery', battery)
            }
            
        }
        break;


        case 0x01:{
            let b = data[1]
            let danger = {}
            if(b & 1){
                danger.connection = false;
            }
            else danger.connection = true;

            if(b & 2){
                danger.shock = true;
            }
            else danger.shock = false

            if (b & 4){
                danger.smoke = true
            }
            else danger.smoke = false
            if (b & 8){
                danger.gas = true
            }
            else danger.gas = false

            if (b & 16){
                danger.flame = true
            }
            else danger.flame = false

            if (b & 32){
                danger.water = true
            }
            else danger.water = false

            for(let socketid in authenticatedSockets){
                authenticatedSockets[socketid].emit('danger', danger)
            }
        }
        break;
    }
})
