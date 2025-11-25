import random
import time


# Simulation parameters
VEHICLE_NUMBER = 1
SIMULATION_STEPS = 3
CURRENT_TO_VOLTAGE_RATIO = 0.5
CURRENT_TO_TEMPERATURE_RATIO = 0.02
CURRENT_TO_SOC_RATIO = 0.01

class Battery:
    def __init__(self, max_voltage, voltage, current, temperature, soc, anomaly):
        self.max_voltage = max_voltage
        self.voltage = voltage
        self.current = current
        self.temperature = temperature
        self.soc = soc
        self.anomaly = anomaly

    def update_randomly(self):   # Simulate battery updates over time
        self.voltage += round(random.uniform(-0.5, 0.5), 2)  # Voltage variation
        self.current += round(random.uniform(-0.2, 0.2), 2)  # Current variation
        self.temperature += round(random.uniform(-0.5, 0.5), 2)  # Temperature variation
        self.soc = max(0, min(1, self.soc + random.uniform(-0.01, 0.01)))  # Keep SOC within 0-1
        self.anomaly = max(0, min(1, self.anomaly + random.uniform(-0.05, 0.05)))  # Anomaly variation

    # def charge(self):

    # def discharge(self):


class Vehicle:
    def __init__(self, vehicle_id, name, brand, battery):
        self.vehicle_id = vehicle_id
        self.name = name
        self.brand = brand
        self.battery = battery

    def update(self):
        self.battery.update_randomly()

    def __repr__(self) -> str:
        pass


# Create a list of vehicles
vehicles = []

prototype = Vehicle(vehicle_id="P10000", name="Prototype", brand="A", battery=Battery(510, 510, 0, 25, 100, 0))
vehicles.append(prototype)

for i in range(VEHICLE_NUMBER):
    vehicle = Vehicle(vehicle_id=f"P{10001+i}", name=f"Prototype-{i+1}", brand="A", battery=Battery(800, 700, 0, 25, 70, 0))
    vehicles.append(vehicle)


for step in range(SIMULATION_STEPS):
    print(f"\nSimulation step {step}")
    for vehicle in vehicles:
        vehicle.update()
        print(f"{vehicle.vehicle_id}: {vehicle.battery.voltage} V")
    time.sleep(1)
