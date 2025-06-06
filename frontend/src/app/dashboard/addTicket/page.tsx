/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateTicketMutation } from '@/redux/services/ticket.service';

type TicketFormData = {
  subject: string;
  description: string;
  category: 'Technical' | 'Billing' | 'General' | '';
  priority: 'Low' | 'Medium' | 'High' | '';
  attachment?: File | null;
};

const CreateTicketForm: React.FC = () => {
  const [formData, setFormData] = useState<TicketFormData>({
    subject: '',
    description: '',
    category: '',
    priority: '',
    attachment: null,
  });

  const [createTicket, { isLoading, data, error }] = useCreateTicketMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, attachment: e.target.files?.[0] || null }));
  };

  const handleSelectChange = (name: keyof TicketFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject || !formData.description || !formData.category || !formData.priority) {
      alert({ title: 'All fields except attachment are required.', variant: 'destructive' });
      return;
    }

    const payload = new FormData();
    payload.append('subject', formData.subject);
    payload.append('description', formData.description);
    payload.append('category', formData.category);
    payload.append('priority', formData.priority);
    if (formData.attachment) {
      payload.append('attachment', formData.attachment);
    }

    createTicket(payload);
  };

  useEffect(() => {
    if (data) {
      alert('Ticket created successfully!');
    }
    if (error) {
      alert('Ticket creation failed!');
    }
  }, [data, error, isLoading]);

  return (
      <div>
        <h2 className='text-2xl font-bold my-10'>Add A New Ticket</h2>
        <form onSubmit={handleSubmit} className="w-[70vw] md:w-[50vw] lg:w-[70vw]  mx-auto space-y-6 bg-white p-6 rounded-xl shadow">
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Category</Label>
          <Select onValueChange={value => handleSelectChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Billing">Billing</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Priority</Label>
          <Select onValueChange={value => handleSelectChange('priority', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="attachment">Attachment (optional)</Label>
        <Input type="file" id="attachment" onChange={handleFileChange} />
      </div>

      <Button disabled={isLoading} type="submit" className="w-full">
        {isLoading ? 'Creating...' : 'Create Ticket'}
      </Button>
    </form>
      </div>
  );
};

export default CreateTicketForm;
