import "reflect-metadata";
import express from "express";

export const generateSampleApp = () => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  return app;
};

