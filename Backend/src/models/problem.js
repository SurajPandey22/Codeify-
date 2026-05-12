const mongoose = require("mongoose");
const { Schema } = mongoose;

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
      index: true,
    },

    
    tags: [
      {
        type: String,
        enum: ["array", "linkedlist", "graph", "dp"],
        index: true,
      },
    ],

    visibleTestCases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String },
      },
    ],

    hiddenTestCases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
      },
    ],

    startCode: [
      {
        language: {
          type: String,
          enum: ["c++", "java", "python", "javascript"],
          required: true,
        },
        initialCode: {
          type: String,
          required: true,
        },
      }
    ],

    
    problemCreator: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },


    referenceSolution:[
              {
        language: {
          type: String,
          enum: ["cpp", "java", "python", "javascript"],
          required: true,
        },
        completeCode: {
          type: String,
          required: true,
        },
      }
    ]
  },
  {
    timestamps: true, 
  }
);

const Problem = mongoose.model("Problem", problemSchema);

module.exports = { Problem };