// import { NextResponse } from 'next/server';
// import { z } from 'zod';
// import { Resend } from 'resend';

// // Email validation schema
// const leadSchema = z.object({
//   email: z.string().email(),
//   name: z.string().min(2),
//   phone: z.string().optional(),
//   address: z.string().optional(),
//   estimatedSavings: z.number().optional(),
//   propertyType: z.string().optional(),
//   ownership: z.string().optional(),
//   roofAge: z.number().optional(),
//   monthlyBill: z.number().optional(),
//   utilityProvider: z.string().optional(),
// });

// type LeadData = z.infer<typeof leadSchema>;

// // Initialize Resend with API key
// const resend = new Resend('re_RLpWaTW5_MLo857XcLryR95cnvikfHotG');

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
    
//     // Validate the input
//     const validatedData = leadSchema.parse(body);
    
//     // Send email notification
//     await resend.emails.send({
//       from: 'Solar Estimator <onboarding@resend.dev>',
//       to: 'cubelocked@gmail.com',
//       subject: 'New Solar Lead',
//       html: `
//         <h2>New Solar Lead from Solar Estimator</h2>
//         <p><strong>Name:</strong> ${validatedData.name}</p>
//         <p><strong>Email:</strong> ${validatedData.email}</p>
//         ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
//         ${validatedData.address ? `<p><strong>Address:</strong> ${validatedData.address}</p>` : ''}
//         ${validatedData.estimatedSavings ? 
//           `<p><strong>Estimated Savings:</strong> $${validatedData.estimatedSavings.toFixed(2)}</p>` : ''}
//         ${validatedData.propertyType ? `<p><strong>Property Type:</strong> ${validatedData.propertyType}</p>` : ''}
//         ${validatedData.ownership ? `<p><strong>Ownership:</strong> ${validatedData.ownership}</p>` : ''}
//         ${validatedData.roofAge ? `<p><strong>Roof Age:</strong> ${validatedData.roofAge} years</p>` : ''}
//         ${validatedData.monthlyBill ? `<p><strong>Monthly Bill:</strong> $${validatedData.monthlyBill}</p>` : ''}
//         ${validatedData.utilityProvider ? `<p><strong>Utility Provider:</strong> ${validatedData.utilityProvider}</p>` : ''}
//       `,
//     });

//     // Send confirmation email to the lead
//     await resend.emails.send({
//       from: 'Solar Estimator <onboarding@resend.dev>',
//       to: validatedData.email,
//       subject: 'Your Solar Energy Consultation Request',
//       html: `
//         <h2>Thank You for Your Interest in Solar Energy</h2>
//         <p>Dear ${validatedData.name},</p>
//         <p>Thank you for taking the first step towards a more sustainable future with solar energy. We have received your consultation request and our team will review your information shortly.</p>
//         <p>We'll be in touch soon to discuss your solar needs and potential savings.</p>
//         <p>Best regards,<br>Solar Estimator Team</p>
//       `,
//     });

//     return NextResponse.json(
//       { message: 'Lead successfully submitted' },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Lead submission error:', error);
//     return NextResponse.json(
//       { error: 'Failed to process lead submission' },
//       { status: 500 }
//     );
//   }
// }
