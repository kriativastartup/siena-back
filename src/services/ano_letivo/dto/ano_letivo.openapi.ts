import {registry} from '../../../openapi/registry';
import * as Schema from './ano_letivo.dto';
import { z } from 'zod';

registry.register('AnoLetivo', Schema.ResponseAnoLectivoDTO);

const BASE = '/api/v1/year';

registry.registerPath({
    method: 'get',
    path: `${BASE}/all/{escola_id}`,
    tags: ['Ano Letivo'],
    request: {
        query: z.object({
            limit: z.string().optional(),
            page: z.string().optional(),
            search: z.string().optional()
        })
    },
    responses: {
        200: {
            description: 'Lista de anos letivos',
            content: {
                'application/json': {
                    schema: Schema.ResponseAnoLectivoDTO.array()
                }
            }
        }
    }
});

// Criar um ano letivo
registry.registerPath({
    method: 'post',
    path: `${BASE}/add`,
    tags: ['Ano Letivo'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: Schema.CreateAnoLectivoDTO
          }
        }
      }
    },
    responses: {
      201: {
        description: 'Ano letivo criado com sucesso',
        content: {
          'application/json': {
            schema: Schema.ResponseAnoLectivoDTO
          }
        }
      },
      400: {
        description: 'Dados inválidos'
      }
    }
  });

  // pegar um ano letivo por id
registry.registerPath({
    method: 'get',
    path: `${BASE}/each/{ano_id}`,
    tags: ['Ano Letivo'],
    request: {
        params: z.object({
            ano_id: z.string().uuid()
        })
    },
    responses: {
        200: {
            description: 'Ano letivo encontrado',
            content: {
                'application/json': {
                    schema: Schema.ResponseAnoLectivoDTO
                }
            }
        },
        404: {
            description: 'Ano letivo não encontrado'
        }
    }
});

// Editar um ano letivo
registry.registerPath({
    method: 'put',
    path: `${BASE}/edit/{ano_id}`,
    tags: ['Ano Letivo'],
    request: {
        params: z.object({
            ano_id: z.string().uuid()
        }),
        body: {
            content: {
                'application/json': {
                    schema: Schema.UpdateAnoLectivoDTO
                }
            }
        }
    },
    responses: {
        200: {
            description: 'Ano letivo atualizado com sucesso',
            content: {
                'application/json': {
                    schema: Schema.ResponseAnoLectivoDTO
                }
            }
        },
        400: {
            description: 'Dados inválidos'
        },
        404: {
            description: 'Ano letivo não encontrado'
        }
    }
});

