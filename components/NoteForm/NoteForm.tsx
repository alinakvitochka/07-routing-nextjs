'use client';

import { Formik, Form, Field, ErrorMessage, FormikProps } from 'formik';
import * as yup from 'yup';
import { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api';
import css from './NoteForm.module.css';

export interface NoteFormProps {
  onCancel: () => void;
}

export interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be no more than 50 characters'),
  content: yup
    .string()
    .max(500, 'Content must be no more than 500 characters'),
  tag: yup
    .string()
    .required('Tag is required')
    .oneOf(
      ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
      'Invalid tag',
    ),
});

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();
  const formikRef = useRef<FormikProps<NoteFormValues>>(null);

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      formikRef.current?.resetForm();
      onCancel();
    },
  });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => {
        createMutation.mutate(values);
      }}
    >
      {({ isSubmitting, isValid, values }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              type="text"
              name="title"
              className={css.input}
            />
            <ErrorMessage
              name="title"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field
              id="tag"
              name="tag"
              as="select"
              className={css.select}
            >
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage
              name="tag"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={
                createMutation.isPending || !isValid || !values.title.trim()
              }
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}