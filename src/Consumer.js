require("dotenv").config();
const amqp = require("amqplib");
const PlaylistService = require("./PlaylistService");
const MailSender = require("./MailSender");
const Listener = require("./Listener");

const init = async () => {
  const playlistService = new PlaylistService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  //create channel
  const channel = await connection.createChannel();
  await channel.assertQueue("export:songs  ", {
    durable: true,
  });

  channel.consume("export:songs", listener.listen, { noAck: true });
};

init();
