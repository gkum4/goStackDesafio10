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

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleUpdateFood: (food: IFoodPlate) => Promise<void>;
  editingFood: IFoodPlate;
}

interface IEditFoodData {
  name: string;
  image: string;
  price: string;
  description: string;
}

const ModalEditFood: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  editingFood,
  handleUpdateFood,
}) => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: IEditFoodData) => {
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
        await handleUpdateFood({
          ...data,
          id: editingFood.id,
          available: editingFood.available,
        });
        setIsOpen();
        return;
      }

      alert('Campos não preenchidos');
    },
    [handleUpdateFood, setIsOpen, editingFood.id, editingFood.available],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>

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

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalEditFood;
