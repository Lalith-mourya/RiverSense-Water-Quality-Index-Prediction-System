# 🌊 River Sense – Water Quality Prediction System

River Sense is a Machine Learning–based project that predicts **Water Quality Index (WQI)** and classifies water quality into categories such as *Excellent, Good, Medium, Bad,* and *Very Bad*.  
The project consists of a **React-based frontend** for visualization and a **Python ML backend** for prediction.

---

## 🚀 Running the Frontend (React + Vite)

### Step 1: Navigate to frontend directory
  cd river-sense-viz-main/river-sense-viz-main
### **Step 2: Install dependencies**
  pip install requirements.txt  
  npm install
### **Step 3: Start development server**
  npm run dev
### S**tep 4: Open in browser**
  http://localhost:5173

## INPUT:
## Enter the required water parameters:
Temperature
Dissolved Oxygen
pH
Conductivity
BOD
Nitrate
Total Coliform
Year
State

## The system outputs:
Predicted WQI value
Water Quality Class

### **Water Quality Classification**
≥ 91	        ->Excellent,
71 – 90	      ->Good,
51 – 70	      ->Medium,
26 – 50	      ->Bad,
≤ 25	        ->Very Bad
