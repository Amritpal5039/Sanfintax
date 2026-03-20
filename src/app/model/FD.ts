// import mongoose from 'mongoose';

// const FDSchema = new mongoose.Schema({
//     email:{
//         type:String,
//         required:true
//     },
//     FD_Name:{
//         type:String,
//         required:true
//     },
//     FD_Amount:{
//         type:Number,
//         required:true
//     },
//     FD_InterestRate:{
//         type:Number,
//         required:true
//     },
//     FD_MaturityDate:{
//         type:Date,
//         required:true
//     },
//     FD_MaturityAmount:{
//         type:Number,
//         required:true
//     },
//     FD_MaturityPeriod:{
//         type:Number,
//         required:true
//     },
//     FD_MaturityType:{
//         type:String,
//         required:true
//     },
//     FD_MaturityStatus:{
//         type:String,
//         required:true
//     },
// },{timestamps:true})

// const FD = mongoose.models.FD || mongoose.model("FD",FDSchema)
// export default FD;


// src/models/FD.ts
// ─────────────────────────────────────────────────────────────────────────────
// Mongoose model for Fixed Deposits.
// Each FD belongs to a user (stored by email, matching your auth setup).
// maturityAmount is calculated before saving using compound interest formula:
//   A = P * (1 + r/n)^(n*t)
//   P = principal, r = annual rate (decimal), n = compounding frequency per year,
//   t = tenure in years
// ─────────────────────────────────────────────────────────────────────────────

import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IFD extends Document {

  bankName: string;
  principalAmount: number;
  interestRate: number;       // annual rate in %  e.g. 7.5
  tenure: number;             // in months
  compoundingFrequency: number; // times per year: 1=yearly,2=half,4=quarterly,12=monthly
  maturityDate: Date;       // "YYYY-MM-DD"
  maturityAmount: number;     // auto-calculated
  createdBy?:Types.ObjectId; // optional reference to user ID if you want to switch to ObjectId later
  createdAt: Date;
  updatedAt: Date;
}

const FDSchema = new Schema<IFD>(
  {
    bankName:  { type: String, required: true, trim: true },
    principalAmount:      { type: Number, required: true, min: 1 },
    interestRate:         { type: Number, required: true, min: 0.01 },  // annual %
    tenure:               { type: Number, required: true, min: 1 },     // months
    compoundingFrequency: { type: Number, required: true, default: 12 }, // monthly default
    maturityDate:         { type: Date, required: true },
    maturityAmount:       { type: Number, default: 0 },
    createdBy:        { type: Schema.Types.ObjectId, required:true, ref: "user"},
  },
  { timestamps: true }
);

// ── Helper: compound interest ─────────────────────────────────────────────────
// Called before every save and findOneAndUpdate
// function calcMaturity(
//   principal: number,
//   annualRatePercent: number,
//   tenureMonths: number,
//   n: number   // compounding frequency per year
// ): number {
//   const r = annualRatePercent / 100;
//   const t = tenureMonths / 12;
//   const amount = principal * Math.pow(1 + r / n, n * t);
//   return Math.round(amount * 100) / 100; // round to 2 decimal places
// }

// ── Pre-save hook ─────────────────────────────────────────────────────────────
// FDSchema.pre("save", function (next) {
//   this.maturityAmount = calcMaturity(
//     this.principalAmount,
//     this.interestRate,
//     this.tenure,
//     this.compoundingFrequency
//   );
//   next();
// });

// Export the helper so the PUT route can recalculate without re-saving
// export { calcMaturity };

// Prevent model re-compilation in Next.js hot-reload
const FD: Model<IFD> =
  mongoose.models.FD || mongoose.model<IFD>("FD", FDSchema);

export default FD;