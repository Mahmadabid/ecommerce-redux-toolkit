"use client";

import React from 'react';
import { StepperProps } from './type';

const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex flex-col items-center mt-8 mb-4">
      <div className="flex space-x-4 xsm:space-x-2 mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                step.completed
                  ? 'bg-b-color'
                  : index === currentStep
                  ? 'bg-b-color'
                  : 'bg-gray-300'
              }`}
            >
              {step.completed ? (
                <span className="text-white">✓</span>
              ) : (
                <span className="text-white">{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`h-1 w-16 ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            )}
          </div>
        ))}
      </div>
      <div className="flex space-x-12 xsm:space-x-9 items-center justify-center">
        {steps.map((step, index) => (
          <div key={index} className="text-center mb-2">
            <span className={`text-sm ${index === currentStep ? 'text-b-color' : 'text-gray-600'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
