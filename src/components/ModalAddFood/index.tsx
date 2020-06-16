import React, { useRef, useCallback } from 'react';

import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

interface ICreateFoodData {
  name: string;
  image: string;
  price: string;
  description: string;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleAddFood: (food: Omit<IFoodPlate, 'id' | 'available'>) => Promise<void>;
}

const ModalAddFood: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  handleAddFood,
}) => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: ICreateFoodData) => {
      if (!data.image.startsWith('http')) {
        alert('Link inválido');
        return;
      }

      if (
        data.image.startsWith('http') &&
        data.description !== '' &&
        data.name !== '' &&
        data.price !== ''
      ) {
        await handleAddFood(data);
        setIsOpen();
        return;
      }

      alert('Campos não preenchidos');
    },
    [handleAddFood, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Novo Prato</h1>

        <p className="inputTitle">URL da imagem</p>
        <Input name="image" placeholder="Cole o link aqui" />

        <div className="rowContainer">
          <div style={{ flex: 3 }}>
            <p className="inputTitle">Nome do prato</p>
            <Input name="name" placeholder="Ex: Moda Italiana" />
          </div>
          <div style={{ flex: 1, marginLeft: 15 }}>
            <p className="inputTitle">Preço</p>
            <Input name="price" placeholder="Ex: 19.90" />
          </div>
        </div>

        <p className="inputTitle">Descrição do prato</p>
        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="add-food-button">
          <p className="text">Adicionar Prato</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalAddFood;
