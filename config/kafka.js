const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],  // Corrected port to 9092
  connectionTimeout: 30000,
});

const producer = kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("Connected to Kafka producer");
  } catch (error) {
    console.error("Error connecting to Kafka producer", error);
  }
};

// Call the connectProducer function to establish a connection
connectProducer();

const sendOrderData = async (order) => {
    try {
      // Log the order data before sending
      const result = await producer.send({
        topic: "orders",
        messages: [
          {
            key: "order",
            value: JSON.stringify(order),
          },
        ],
      });

      console.log("Order sent successfully:", result);
    } catch (error) {
      console.error("Error sending order", error);
    } finally {
      // Optionally, disconnect the producer when done
      // await producer.disconnect();
    }
  };

  const consumer = kafka.consumer({ groupId: "my-group" });

const connectConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "orders", fromBeginning: true });
    console.log("Connected to Kafka consumer");
  } catch (error) {
    console.error("Error connecting to Kafka consumer", error);
  }
};

const consumeOrders = async () => {
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(message.value.toString());
      console.log("Received order:", order);
    },
  });
};

// Call the connectConsumer function to establish a connection and subscribe to the "orders" topic
connectConsumer().then(() => {
  // Start consuming orders
  consumeOrders();
});

module.exports = {
  sendOrderData,
};
