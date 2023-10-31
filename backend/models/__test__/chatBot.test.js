import { formatMsg, sendMsgByBot } from "../chatBot";

describe("should send msg by chat bot", () => {
  // Test send msg by chat bot
  it("should send msg by chat bot", async () => {
    // Token and id
    const botIdToken = {
      chat_id: "1027259614",
      token: "6036458497:AAFOS4yKzMkZEekK1WCEpjbPyzuG3jzrYu0",
    };
    //  Message
    const child = {
      include: "test_include",
      exclude: "test_exclude",
      set_price: "2000",
      new_price: "1000",
      svr: "8890",
      nofi_time: "2021-05-01 00:00",
    };
    const item = {
      name: "test_name",
      type: 2,
    };

    const messageText = formatMsg("TEST", child, item);

    //  Send msg by chat bot
    const response = await sendMsgByBot(botIdToken, messageText);

    expect(response.status).toBe(200);
  });
});
