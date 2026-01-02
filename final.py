import numpy as np
import pandas as pd
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.linear_model import LinearRegression, Ridge, Lasso, LogisticRegression
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.svm import SVR, SVC
import pickle
import os

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

data['npH'] = data.ph.apply(lambda x: (100 if (8.5 >= x >= 7)
                                       else (80 if (8.6 >= x >= 8.5) or (6.9 >= x >= 6.8)
                                             else (60 if (8.8 >= x >= 8.6) or (6.8 >= x >= 6.7)
                                                   else (40 if (9 >= x >= 8.8) or (6.7 >= x >= 6.5)
                                                         else 0)))))
data['ndo'] = data.do.apply(lambda x: (100 if (x >= 6)
                                       else (80 if (6 >= x >= 5.1)
                                             else (60 if (5 >= x >= 4.1)
                                                   else (40 if (4 >= x >= 3)
                                                         else 0)))))
data['nco'] = data.tc.apply(lambda x: (100 if (5 >= x >= 0)
                                       else (80 if (50 >= x >= 5)
                                             else (60 if (500 >= x >= 50)
                                                   else (40 if (10000 >= x >= 500)
                                                         else 0)))))
data['nbdo'] = data.bod.apply(lambda x: (100 if (3 >= x >= 0)
                                         else (80 if (6 >= x >= 3)
                                               else (60 if (80 >= x >= 6)
                                                     else (40 if (125 >= x >= 80)
                                                           else 0)))))
data['nec'] = data.co.apply(lambda x: (100 if (75 >= x >= 0)
                                       else (80 if (150 >= x >= 75)
                                             else (60 if (225 >= x >= 150)
                                                   else (40 if (300 >= x >= 225)
                                                         else 0)))))
data['nna'] = data.na.apply(lambda x: (100 if (20 >= x >= 0)
                                       else (80 if (50 >= x >= 20)
                                             else (60 if (100 >= x >= 50)
                                                   else (40 if (200 >= x >= 100)
                                                         else 0)))))

data['wph'] = data.npH * 0.165
data['wdo'] = data.ndo * 0.281
data['wbdo'] = data.nbdo * 0.234
data['wec'] = data.nec * 0.009
data['wna'] = data.nna * 0.028
data['wco'] = data.nco * 0.281
data['wqi'] = data.wph + data.wdo + data.wbdo + data.wec + data.wna + data.wco

data = data[np.isfinite(data['wqi'])]

X = data[['temp', 'do', 'ph', 'co', 'bod', 'na', 'tc', 'year']]
data['state'] = data['state'].fillna('Unknown').astype(str)
one_hot = pd.get_dummies(data['state'], prefix='state')
X = pd.concat([X, one_hot], axis=1)
X.fillna(0, inplace=True)

y = data['wqi']



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


data['wqi_class'] = data['wqi'].apply(get_wqi_class)
y_class = data['wqi_class']



def evaluate_regression_model(name, model_class, X, y, runs=10):
    best_r2 = -np.inf
    best_model = None
    all_r2, all_mse, all_mae = [], [], []

    for run in range(runs):
        cv = KFold(n_splits=10, shuffle=True, random_state=42 + run)
        model = model_class()

        r2_scores = cross_val_score(model, X, y, cv=cv, scoring='r2')
        mse_scores = cross_val_score(
            model, X, y, cv=cv, scoring='neg_mean_squared_error')
        mae_scores = cross_val_score(
            model, X, y, cv=cv, scoring='neg_mean_absolute_error')

        mean_r2 = r2_scores.mean()
        mean_mse = -mse_scores.mean()
        mean_mae = -mae_scores.mean()

        all_r2.append(mean_r2)
        all_mse.append(mean_mse)
        all_mae.append(mean_mae)

        if mean_r2 > best_r2:
            best_r2 = mean_r2
            best_model = model_class()
            best_model.fit(X, y)

        print(f'\n{name} Run {run + 1} Regression Metrics:')
        print(f'Mean R2: {mean_r2:.2f} (std: {r2_scores.std():.2f})')
        print(f'Mean MSE: {mean_mse:.2f} (std: {(-mse_scores).std():.2f})')
        print(f'Mean MAE: {mean_mae:.2f} (std: {(-mae_scores).std():.2f})')

    return best_model, np.mean(all_r2), np.mean(all_mse), np.mean(all_mae)


def evaluate_classification_model(name, model_class, X, y_class, runs=10):
    best_acc = 0
    best_model = None
    all_acc, all_prec, all_rec, all_f1 = [], [], [], []

    for run in range(runs):
        cv = KFold(n_splits=10, shuffle=True, random_state=42 + run)
        model = model_class()

        acc_scores = cross_val_score(
            model, X, y_class, cv=cv, scoring='accuracy')
        prec_scores = cross_val_score(
            model, X, y_class, cv=cv, scoring='precision_macro')
        rec_scores = cross_val_score(
            model, X, y_class, cv=cv, scoring='recall_macro')
        f1_scores = cross_val_score(
            model, X, y_class, cv=cv, scoring='f1_macro')

        mean_acc = acc_scores.mean()
        mean_prec = prec_scores.mean()
        mean_rec = rec_scores.mean()
        mean_f1 = f1_scores.mean()

        all_acc.append(mean_acc)
        all_prec.append(mean_prec)
        all_rec.append(mean_rec)
        all_f1.append(mean_f1)

        if mean_acc > best_acc:
            best_acc = mean_acc
            best_model = model_class()
            best_model.fit(X, y_class)

        print(f'\n{name} Run {run + 1} Classification Metrics:')
        print(f'Mean Accuracy: {mean_acc:.2f} (std: {acc_scores.std():.2f})')
        print(
            f'Mean Precision: {mean_prec:.2f} (std: {prec_scores.std():.2f})')
        print(f'Mean Recall: {mean_rec:.2f} (std: {rec_scores.std():.2f})')
        print(f'Mean F1-Score: {mean_f1:.2f} (std: {f1_scores.std():.2f})')

    return best_model, np.mean(all_acc), np.mean(all_prec), np.mean(all_rec), np.mean(all_f1)


models_reg = {
    'LinearRegression': LinearRegression,
    'Ridge': Ridge,
    'Lasso': Lasso,
    'RandomForestRegressor': lambda: RandomForestRegressor(random_state=42),
    'SVR': SVR
}

models_class = {
    'LogisticRegression': lambda: LogisticRegression(max_iter=1000, multi_class='auto'),
    'RandomForestClassifier': lambda: RandomForestClassifier(random_state=42),
    'SVC': SVC
}

best_reg_score = -np.inf
best_reg_model = None
best_reg_name = ''
best_reg_metrics = {}

for name, model_class in models_reg.items():
    model, mean_r2, mean_mse, mean_mae = evaluate_regression_model(
        name, model_class, X, y)
    if mean_r2 > best_reg_score:
        best_reg_score = mean_r2
        best_reg_model = model
        best_reg_name = name
        best_reg_metrics = {'R2': mean_r2, 'MSE': mean_mse, 'MAE': mean_mae}

best_class_score = 0
best_class_model = None
best_class_name = ''
best_class_metrics = {}

for name, model_class in models_class.items():
    model, mean_acc, mean_prec, mean_rec, mean_f1 = evaluate_classification_model(
        name, model_class, X, y_class)
    if mean_acc > best_class_score:
        best_class_score = mean_acc
        best_class_model = model
        best_class_name = name
        best_class_metrics = {
            'Accuracy': mean_acc, 'Precision': mean_prec, 'Recall': mean_rec, 'F1': mean_f1}

if best_reg_model:
    with open('best_reg_model.pkl', 'wb') as f:
        pickle.dump(best_reg_model, f)
    print(
        f'\nSaved best regression model: {best_reg_name} with mean R2 {best_reg_score:.2f}')
    print(
        f'Best Regression Metrics: R2={best_reg_metrics["R2"]:.2f}, MSE={best_reg_metrics["MSE"]:.2f}, MAE={best_reg_metrics["MAE"]:.2f}')

if best_class_model:
    with open('best_class_model.pkl', 'wb') as f:
        pickle.dump(best_class_model, f)
    print(
        f'Saved best classification model: {best_class_name} with mean Accuracy {best_class_score:.2f}')
    print(
        f'Best Classification Metrics: Accuracy={best_class_metrics["Accuracy"]:.2f}, Precision={best_class_metrics["Precision"]:.2f}, Recall={best_class_metrics["Recall"]:.2f}, F1={best_class_metrics["F1"]:.2f}')

if best_reg_model:
    print('\nHybrid Evaluation (Regression -> Classification):')

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_class, test_size=0.2, random_state=42)
    y_wqi_pred = best_reg_model.predict(X_test)
    y_class_pred = pd.Series(y_wqi_pred).apply(get_wqi_class)
    acc = accuracy_score(y_test, y_class_pred)
    prec = precision_score(y_test, y_class_pred, average='macro')
    rec = recall_score(y_test, y_class_pred, average='macro')
    f1 = f1_score(y_test, y_class_pred, average='macro')
    print(f'Hybrid Accuracy: {acc:.2f}')
    print(f'Hybrid Precision: {prec:.2f}')
    print(f'Hybrid Recall: {rec:.2f}')
    print(f'Hybrid F1-Score: {f1:.2f}')



def predict_wqi(features_dict, reg_model_path='best_reg_model.pkl', class_model_path='best_class_model.pkl'):
    """
    Predict WQI (regression) and class (classification) from input features.
    features_dict: Dict with keys like {'temp': 25.0, 'do': 6.5, 'ph': 7.2, 'co': 100, 'bod': 2.5, 'na': 10, 'tc': 50, 'year': 2023, 'state': 'California'}
    """
    with open(reg_model_path, 'rb') as f:
        reg_model = pickle.load(f)
    with open(class_model_path, 'rb') as f:
        class_model = pickle.load(f)

    input_df = pd.DataFrame([features_dict])

    state_one_hot = pd.get_dummies(input_df['state'], prefix='state')
    input_df = input_df.drop('state', axis=1)
    input_df = pd.concat([input_df, state_one_hot], axis=1)
    for col in X.columns:
        if col not in input_df.columns:
            input_df[col] = 0
    input_df = input_df[X.columns]  
    wqi_pred = reg_model.predict(input_df)[0]
    class_pred = class_model.predict(input_df)[0]
    hybrid_class_pred = get_wqi_class(wqi_pred)

    return {
        'predicted_wqi': wqi_pred,
        'predicted_class': class_pred,
        'hybrid_class_from_reg': hybrid_class_pred
    }

print("\nModel robustness and generalization assessed via 10-fold cross-validation.")
print("High mean scores with low standard deviation indicate good generalization and robustness.")