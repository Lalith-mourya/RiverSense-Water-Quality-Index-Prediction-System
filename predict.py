import numpy as np
import pandas as pd
import pickle
import warnings

warnings.filterwarnings(action='ignore')
data = pd.read_csv('water_dataX.csv', encoding="ISO-8859-1")
data.fillna(0, inplace=True)

data['Temp'] = pd.to_numeric(data['Temp'], errors='coerce')
data['D.O. (mg/l)'] = pd.to_numeric(data['D.O. (mg/l)'], errors='coerce')
data['PH'] = pd.to_numeric(data['PH'], errors='coerce')
data['B.O.D. (mg/l)'] = pd.to_numeric(data['B.O.D. (mg/l)'], errors='coerce')
data['CONDUCTIVITY (umhos/cm)'] = pd.to_numeric(
    data['CONDUCTIVITY (umhos/cm)'], errors='coerce')
data['NITRATENAN N+ NITRITENANN (mg/l)'] = pd.to_numeric(
    data['NITRATENAN N+ NITRITENANN (mg/l)'], errors='coerce')
data['TOTAL COLIFORM (MPN/100ml)Mean'] = pd.to_numeric(
    data['TOTAL COLIFORM (MPN/100ml)Mean'], errors='coerce')

start = 2
end = 1779
station = data.iloc[start:end, 0]
location = data.iloc[start:end, 1]
state = data.iloc[start:end, 2]
temp = data.iloc[start:end, 3].astype(np.float64)
do = data.iloc[start:end, 4].astype(np.float64)
ph = data.iloc[start:end, 5].astype(np.float64)
co = data.iloc[start:end, 6].astype(np.float64)
bod = data.iloc[start:end, 7].astype(np.float64)
na = data.iloc[start:end, 8].astype(np.float64)
tc = data.iloc[start:end, 10].astype(np.float64)
year = data.iloc[start:end, 11].astype(np.float64)

data = pd.concat([station, location, state, temp, do,
                 ph, co, bod, na, tc, year], axis=1)
data.columns = ['station', 'location', 'state', 'temp',
                'do', 'ph', 'co', 'bod', 'na', 'tc', 'year']


X = data[['temp', 'do', 'ph', 'co', 'bod', 'na', 'tc', 'year']]
data['state'] = data['state'].fillna('Unknown').astype(str)
one_hot = pd.get_dummies(data['state'], prefix='state')
X = pd.concat([X, one_hot], axis=1)
X.fillna(0, inplace=True)
training_columns = X.columns.tolist()

with open('best_reg_model.pkl', 'rb') as f:
    model = pickle.load(f)




def get_wqi_class(wqi):
    if wqi >= 91:
        return 'Excellent'
    elif wqi >= 71:
        return 'Good'
    elif wqi >= 51:
        return 'Medium'
    elif wqi >= 26:
        return 'Bad'
    else:
        return 'Very Bad'

print("Enter the following feature values:")
temp = float(input("Temperature (temp): "))
do = float(input("Dissolved Oxygen (do in mg/l): "))
ph = float(input("pH: "))
co = float(input("Conductivity (co in umhos/cm): "))
bod = float(input("BOD (bod in mg/l): "))
na = float(input("Nitrate (na in mg/l): "))
tc = float(input("Total Coliform (tc in MPN/100ml): "))
year = float(input("Year: "))
state = input("State (e.g., 'Unknown' or specific state): ")

features_dict = {
    'temp': temp,
    'do': do,
    'ph': ph,
    'co': co,
    'bod': bod,
    'na': na,
    'tc': tc,
    'year': year,
    'state': state
}
input_df = pd.DataFrame([features_dict])

state_one_hot = pd.get_dummies(input_df['state'], prefix='state')
input_df = input_df.drop('state', axis=1)
input_df = pd.concat([input_df, state_one_hot], axis=1)

for col in training_columns:
    if col not in input_df.columns:
        input_df[col] = 0
input_df = input_df[training_columns]

wqi_pred = model.predict(input_df)[0]

wqi_class = get_wqi_class(wqi_pred)

print(f"\nPredicted WQI: {wqi_pred:.2f}")
print(f"Water Quality: {wqi_class}")