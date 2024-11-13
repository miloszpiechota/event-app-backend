const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");


async function createTransporter() {
  // Create test account for Ethereal
  let testAccount = await nodemailer.createTestAccount();

  // Configure transporter with Ethereal SMTP details
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user, // Generated Ethereal user
      pass: testAccount.pass, // Generated Ethereal password
    },
  });
}

router.post("/", async (req, res) => {
  const { userEmail, eventDetails } = req.body;

  try {
    // Get transporter
    const transporter = await createTransporter();

    // Configure mail options
    const mailOptions = {
      from: '"Event Team" <no-reply@event.com>',
      to: userEmail,
      subject: "Informacje o Twoim Bilecie",
      text: `Cześć!\n\n
        Oto szczegóły Twojego biletu na wydarzenie "${eventDetails.title}":\n
        - Data rozpoczęcia: ${eventDetails.startDate}\n
        - Data zakończenia: ${eventDetails.endDate}\n
        - Lokalizacja: ${eventDetails.locationName}, ${eventDetails.cityName}\n
        - Kategoria: ${eventDetails.selectedCategory}\n
        - Ilość biletów: ${eventDetails.quantity}\n
        - Łączna kwota: ${eventDetails.totalAmount} zł\n\n
        Życzymy Ci wspaniałych wrażeń podczas wydarzenia!\n
        Pozdrawiamy,\n
        Zespół Wydarzeń`,
    };

    // Send mail
    let info = await transporter.sendMail(mailOptions);

    // Log preview URL (you can view the email here)
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
    res.status(200).json({
      success: true,
      message: "Ticket information email sent",
      previewUrl: nodemailer.getTestMessageUrl(info), // Include preview URL in response
    });
  } catch (error) {
    console.error("Error sending ticket information email:", error);
    res.status(500).json({ success: false, message: "Failed to send ticket information email" });
  }
});

module.exports = router;
