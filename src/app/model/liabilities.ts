// server/models/Liability.ts

import mongoose, { Schema, Document } from "mongoose";

export interface ILiability extends Document {
  name: string;
  type: "home_loan" | "car_loan" | "personal_loan" | "credit_card" | "education_loan" | "other";
  principalAmount: number;
  outstandingAmount: number;
  interestRate: number; // annual rate in %
  emiAmount: number;
  startDate: Date;
  endDate: Date;
  lenderName: string;
  notes?: string;
  createdBy:string;
  createdAt: Date;
  updatedAt: Date;
}

const LiabilitySchema: Schema = new Schema(
  {
    createdBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      // e.g. "Home Loan - SBI", "HDFC Credit Card"
    },

    type: {
      type: String,
      enum: ["home_loan", "car_loan", "personal_loan", "credit_card", "education_loan", "other"],
      required: true,
    },

    principalAmount: {
      type: Number,
      required: true,
      min: 0,
      // Original loan/credit amount taken
    },

    outstandingAmount: {
      type: Number,
      required: true,
      min: 0,
      // Current remaining balance to be paid
    },

    interestRate: {
      type: Number,
      required: true,
      min: 0,
      // Annual interest rate in percentage, e.g. 8.5 for 8.5%
    },

    emiAmount: {
      type: Number,
      required: true,
      min: 0,
      // Monthly EMI amount
    },

    startDate: {
      type: Date,
      required: true,
      // When the loan started
    },

    endDate: {
      type: Date,
      required: true,
      // Expected closure/maturity date
    },

    lenderName: {
      type: String,
      required: true,
      trim: true,
      // e.g. "SBI", "HDFC Bank", "Bajaj Finance"
    },

    notes: {
      type: String,
      default: "",
      // Optional remarks
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Index for fast queries per user
LiabilitySchema.index({ name: 1 });

export default mongoose.models.Liability || mongoose.model<ILiability>("Liability", LiabilitySchema);