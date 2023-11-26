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
      console.log(order);
  
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

module.exports = {
  sendOrderData,
};
