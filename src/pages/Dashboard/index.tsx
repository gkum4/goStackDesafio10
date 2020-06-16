import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const newFoods = await api.get('/foods');
      setFoods(newFoods.data);
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const newFood = await api.post('/foods', { ...food, available: true });
      setFoods([...foods, newFood.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: IFoodPlate): Promise<void> {
    const updateFood = { ...food };
    console.log(updateFood);
    await api.put(`/foods/${updateFood.id}`, updateFood);
    const foodsArr = [...foods];
    const index = foodsArr.findIndex(item => {
      return item.id === updateFood.id;
    });
    foodsArr[index] = updateFood;
    setFoods(foodsArr);
    // TODO UPDATE A FOOD PLATE ON THE API
  }

  async function handleDeleteFood(id: number): Promise<void> {
    await api.delete(`/foods/${id}`);
    const foodsArr = [...foods];
    const index = foodsArr.findIndex(item => {
      return item.id === id;
    });
    foodsArr.splice(index, 1);
    setFoods(foodsArr);
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    setEditingFood(food);
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              handleUpdateFood={handleUpdateFood}
              setEditingFood={setEditingFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
