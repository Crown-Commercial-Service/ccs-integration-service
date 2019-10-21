/*
 * Crown Commercial Service
 *
 * This is the Crown Commercial Service API definition. 
 *
 * OpenAPI spec version: 0_5
 * Contact: api@crowncommercial.gov.uk
 * Generated by: https://github.com/swagger-api/swagger-codegen.git
 */
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Swashbuckle.AspNetCore.SwaggerGen;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using IO.Swagger.Attributes;
using IO.Swagger.Security;
using Microsoft.AspNetCore.Authorization;
using IO.Swagger.Models;

namespace IO.Swagger.Controllers
{ 
    /// <summary>
    /// 
    /// </summary>
    [ApiController]
    public class IttApiController : ControllerBase
    { 
        /// <summary>
        /// Create an invitiation to tender i.e. a sourcing event
        /// </summary>
        /// <remarks>Creates a CCS invitation to tender on the sourcing platform for a given procurement case.</remarks>
        /// <param name="body">Created sourcing object</param>
        /// <response code="201">tender created</response>
        /// <response code="0">successful operation</response>
        [HttpPost]
        [Route("/Crown-Commercial/crown-commercial-service/0_5/tenders")]
        [ValidateModelState]
        [SwaggerOperation("CreateTender")]
        [SwaggerResponse(statusCode: 201, type: typeof(InlineResponse201), description: "tender created")]
        public virtual IActionResult CreateTender([FromBody]Procurement body)
        { 
            //TODO: Uncomment the next line to return response 201 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(201, default(InlineResponse201));

            //TODO: Uncomment the next line to return response 0 or use other options such as return this.NotFound(), return this.BadRequest(..), ...
            // return StatusCode(0);
            string exampleJson = null;
            exampleJson = "{\n  \"projectCode\" : \"projectCode\",\n  \"ittCode\" : \"ittCode\"\n}";
            
                        var example = exampleJson != null
                        ? JsonConvert.DeserializeObject<InlineResponse201>(exampleJson)
                        : default(InlineResponse201);            //TODO: Change the data returned
            return new ObjectResult(example);
        }
    }
}